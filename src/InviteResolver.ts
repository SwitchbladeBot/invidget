import DiscordApi from "./DiscordApi"

export const guildIdRegex = /^[0-9]{16,18}$/;
export const inviteRegex = /^(?:https?:\/\/)?(?:www\.)?(?:discord(?:app)?)\.(?:com|gg)\/(?:invite\/)?([a-zA-Z0-9-]+)$/;

export default class InviteResolver {
  static async resolve(query: string = ''): Promise<string> {
    if (guildIdRegex.test(query)) {
      const { instant_invite: inviteUrl } = await DiscordApi.getWidget(query);
      const match = inviteUrl?.match(inviteRegex);
      if (!match) throw new Error("Failed to extract invite code from widget URL.");
      return match[1];
    }

    return query;
  }
}
