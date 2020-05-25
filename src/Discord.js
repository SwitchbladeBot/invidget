const fetch = require('node-fetch')

module.exports = class Discord {
  static getInvite(inviteCode) {
    return fetch(`https://discordapp.com/api/v6/invites/${inviteCode}?with_counts=true`).then(res => res.json())
  }

  static getIcon(guildId, iconId) {
    return fetch(`https://cdn.discordapp.com/icons/${guildId}/${iconId}${iconId.startsWith('a_') ? '.gif' : '.jpg'}`).then(res => res.buffer()).then(buffer => buffer.toString('base64'))
  }
}