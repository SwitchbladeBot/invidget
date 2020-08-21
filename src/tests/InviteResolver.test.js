/* global fetch */

const InviteResolver = require('../InviteResolver.js')

const fs = require('fs')

const mockWidgets = fs.readdirSync(require('path').join(__dirname, 'widgets')).map(file => {
  return {
    data: require('./widgets/' + file),
    expect: file.replace('.json', '')
  }
})

const mockInviteCodes = require('fs').readdirSync(require('path').join(__dirname, 'invites')).map(file => {
  return file.replace('.json', '')
})

describe('resolving', () => {
  test.each(mockWidgets)('should use the widget endpoint to get invite codes from guild Ids', async widget => {
    fetch.mockResponse(JSON.stringify(widget.data))
    const inviteCode = await InviteResolver.resolve(widget.data.id)
    expect(inviteCode).toMatch(widget.expect)
  })

  test.each(mockInviteCodes)('should passthrough an invite code if it doesn\'t match a guild ID', async code => {
    const inviteCode = await InviteResolver.resolve(code)
    expect(inviteCode).toMatch(code)
  })
})
