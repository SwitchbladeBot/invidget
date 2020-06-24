/* global fetch */

const InviteRenderer = require('../InviteRenderer.js')
const constants = require('../constants.js')

const mockInvites = require('fs').readdirSync(require('path').join(__dirname, 'invites')).map(file => {
  const invite = require('./invites/' + file)
  return invite
})

describe('badges', () => {
  const verifiedInvites = mockInvites.filter(i => i.guild.features.includes('VERIFIED'))
  test.each(verifiedInvites)('should render the verified badge for verified guilds', async invite => {
    fetch.mockResponse(JSON.stringify(invite))
    const svg = await InviteRenderer.render(invite.code, 'en')
    expect(svg).toMatch(constants.VERIFIED_ICON)
  })

  const partneredInvites = mockInvites.filter(i => i.guild.features.includes('PARTNERED'))
  test.each(partneredInvites)('should render the partner badge for partnered guilds', async invite => {
    fetch.mockResponse(JSON.stringify(invite))
    const svg = await InviteRenderer.render(invite.code, 'en')
    expect(svg).toMatch(constants.PARTNER_ICON)
  })

  const notPartnerOrVerified = mockInvites.filter(i => !i.guild.features.includes('PARTNERED') && !i.guild.features.includes('VERIFIED'))
  test.each(notPartnerOrVerified)('should render no badge for guilds that are neither partnered nor verified', async invite => {
    fetch.mockResponse(JSON.stringify(invite))
    const svg = await InviteRenderer.render(invite.code, 'en')
    expect(svg).not.toMatch(constants.VERIFIED_ICON)
    expect(svg).not.toMatch(constants.PARTNER_ICON)
  })
})
