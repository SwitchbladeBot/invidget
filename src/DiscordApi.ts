import { APIGuildWidget, APIInvite } from 'discord-api-types/v10';

const API_BASE_URL = 'https://discord.com/api/v10';
const CDN_BASE_URL = 'https://cdn.discordapp.com';

export type InvidgetInvite = { iconBase64: string } & APIInvite;

export class DiscordApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly retryAfter: string | null = null,
	) {
		super(message);
		this.name = 'DiscordApiError';
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	get isNotFound(): boolean {
		return this.status === 404;
	}
}

async function assertOk(res: Response, what: string): Promise<void> {
	if (res.ok) return;
	// Drain the body so the connection can be reused.
	await res.body?.cancel();
	const retryAfter = res.headers.get('retry-after');
	throw new DiscordApiError(
		`Discord ${res.status} for ${what}${retryAfter ? ` (retry-after ${retryAfter}s)` : ''}`,
		res.status,
		retryAfter,
	);
}

/**
 * Convert bytes to base64 in chunks. Building the binary string one char at a
 * time is quadratic-ish and slow for large animated GIFs.
 */
function bytesToBase64(bytes: Uint8Array): string {
	const CHUNK = 0x8000;
	let binary = '';
	for (let i = 0; i < bytes.length; i += CHUNK) {
		binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
	}
	return btoa(binary);
}

export default class DiscordApi {
	static async getWidget(guildId: string): Promise<APIGuildWidget> {
		const res = await fetch(`${API_BASE_URL}/guilds/${guildId}/widget.json`, {
			// widget.json rarely changes; cache successful lookups for a few minutes.
			cf: { cacheTtlByStatus: { '200-299': 300, '403-404': 60, '400-402': 0, '405-599': 0 } },
		});
		await assertOk(res, `widget of guild ${guildId}`);
		return res.json();
	}

	static async getInvite(inviteCode: string, animation: boolean = true): Promise<InvidgetInvite> {
		const res = await fetch(`${API_BASE_URL}/invites/${encodeURIComponent(inviteCode)}?with_counts=true`);
		await assertOk(res, `invite ${inviteCode}`);

		const apiInvite: APIInvite = await res.json();

		return {
			...apiInvite,
			iconBase64:
				apiInvite.guild && apiInvite.guild.icon
					? await this.fetchIcon(this.getIconUrl(apiInvite.guild.id, apiInvite.guild.icon, animation))
					: '',
		};
	}

	static async fetchIcon(iconUrl: string): Promise<string> {
		// Icon URLs contain the icon hash, so their content never changes: cache them for a year.
		const res = await fetch(iconUrl, {
			cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 31536000, '400-599': 0 } },
		});
		await assertOk(res, `icon ${iconUrl}`);
		return bytesToBase64(new Uint8Array(await res.arrayBuffer()));
	}

	static getIconUrl(guildId: string, iconId: string, animation: boolean = true): string {
		const ext = iconId.startsWith('a_') && animation ? '.gif' : '.png';
		return `${CDN_BASE_URL}/icons/${guildId}/${iconId}${ext}`;
	}
}
