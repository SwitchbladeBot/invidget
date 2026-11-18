import { APIGuildWidget, APIInvite } from 'discord-api-types/v10';

const API_BASE_URL = 'https://discord.com/api/v10/';
const CDN_BASE_URL = 'https://cdn.discordapp.com';

export type InvidgetInvite = { iconBase64: string } & APIInvite;

export default class DiscordApi {
	static async getWidget(guildId: string): Promise<APIGuildWidget> {
		const res = await fetch(`${API_BASE_URL}/guilds/${guildId}/widget.json`);
		if (!res.ok) throw new Error(`Failed to fetch widget for guild ${guildId}: ${res.statusText}`);
		return res.json();
	}

	static async getInvite(inviteCode: string, animation: boolean = true): Promise<InvidgetInvite> {
		const res = await fetch(`${API_BASE_URL}/invites/${inviteCode}?with_counts=true`);
		if (!res.ok) throw new Error(`Failed to fetch invite ${inviteCode}: ${res.statusText}`);

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
		const res = await fetch(iconUrl);
		if (!res.ok) throw new Error(`Failed to fetch icon from ${iconUrl}: ${res.statusText}`);

		const arrayBuffer = await res.arrayBuffer();
		const bytes = new Uint8Array(arrayBuffer);
		let binary = '';
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	}

	static getIconUrl(guildId: string, iconId: string, animation: boolean = true): string {
		const ext = iconId.startsWith('a_') && animation ? '.gif' : '.png';
		return `${CDN_BASE_URL}/icons/${guildId}/${iconId}${ext}`;
	}
}
