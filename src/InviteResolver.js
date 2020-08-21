const Discord = require('./Discord.js')

const guildIdRegex = /^[0-9]{16,18}$/
const inviteRegex = /^(?:https?:\/\/)?(?:www\.)?(?:discord(?:app)?)\.(?:com|gg)\/(?:invite\/)?([a-zA-Z0-9-]+)$/

module.exports = class InviteResolver {
  static async resolve (query) {
    if (guildIdRegex.test(query)) {
      const { instant_invite: inviteUrl } = await Discord.getWidget(query)
      return inviteUrl.match(inviteRegex)[1]
    }

    return query
  }
}
