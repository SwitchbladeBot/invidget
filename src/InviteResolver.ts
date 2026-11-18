import DiscordApi, { DiscordApiError } from './DiscordApi';

// Discord snowflakes are currently 17–19 digits; allow a little headroom.
export const guildIdRegex = /^[0-9]{17,20}$/;
export const inviteCodeRegex = /^[a-zA-Z0-9-]{2,64}$/;
export const inviteRegex = /^(?:https?:\/\/)?(?:www\.)?(?:discord(?:app)?)\.(?:com|gg)\/(?:invite\/)?([a-zA-Z0-9-]+)$/;

export class InvalidInviteError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidInviteError';
	}
}

export default class InviteResolver {
	static async resolve(query: string = ''): Promise<string> {
		if (guildIdRegex.test(query)) {
			let inviteUrl: string | null;
			try {
				({ instant_invite: inviteUrl } = await DiscordApi.getWidget(query));
			} catch (err) {
				// 403 = widget disabled, 404 = unknown guild. Anything else (429, 5xx) is transient.
				if (err instanceof DiscordApiError && (err.status === 403 || err.status === 404)) {
					throw new InvalidInviteError('Guild not found or its widget is disabled.');
				}
				throw err;
			}
			const match = inviteUrl?.match(inviteRegex);
			if (!match) throw new InvalidInviteError('Guild has no widget invite configured.');
			return match[1];
		}

		// Reject paths that can't be invite codes (scanners, typos, "/") without calling Discord.
		if (!inviteCodeRegex.test(query)) throw new InvalidInviteError('Invalid invite code.');

		return query;
	}
}
