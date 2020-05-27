const fetch = require('node-fetch')

module.exports = class Discord {
  static getInvite (inviteCode) {
    return fetch(`https://discordapp.com/api/v6/invites/${inviteCode}?with_counts=true`).then(res => res.json())
  }

  static fetchIcon (iconUrl) {
    return fetch(iconUrl).then(res => res.buffer()).then(buffer => buffer.toString('base64'))
  }

  static getIconUrl (guildId, iconId) {
    return `https://cdn.discordapp.com/icons/${guildId}/${iconId}${iconId.startsWith('a_') ? '.gif' : '.jpg'}`
  }
}
