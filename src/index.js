const express = require('express')
const app = express()
const fetch = require('node-fetch')

const svgdom = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

const TextToSVG = require('text-to-svg');
const whitneyBold = TextToSVG.loadSync('./src/fonts/WhitneyBoldRegular.ttf')
const whitneySemibold = TextToSVG.loadSync('./src/fonts/WhitneySemiboldRegular.ttf')
const whitneyMedium = TextToSVG.loadSync('./src/fonts/WhitneyMediumRegular.ttf')

const strings = require('./strings.json')
const PORT = process.env.PORT || 80

const PADDING = 16
const ICON_SIZE = 50
const SERVER_NAME_SIZE = 16
const HEADER_SIZE = 12
const INVITE_WIDTH = 430
const INVITE_HEIGHT = 110
const BUTTON_WIDTH = 95
const BUTTON_HEIGHT = 40
const BADGE_MARGIN_RIGHT = 8
const STATUS_CIRCLE_MARGIN_RIGHT = 4

const INNER_X = 2 * PADDING + ICON_SIZE
const INNER_Y = 2 * PADDING + HEADER_SIZE

const Constants = require('./constants.js')

const iconCache = {}
const inviteCache = {}

app.get('/svg/:inviteCode', async (req, res) => {
  const hrstart = process.hrtime()
  let invite
  let inviteCacheHit
  if (inviteCache[req.params.inviteCode]) {
    inviteCacheHit = true
    invite = inviteCache[req.params.inviteCode]
  } else {
    inviteCacheHit = false
    invite = await fetch(`https://discordapp.com/api/v6/invites/${req.params.inviteCode}?with_counts=true`).then(res => res.json())
    inviteCache[req.params.inviteCode] = invite
  }
  const locale = strings[req.query.language] || strings['en']

  const window = svgdom.createSVGWindow()
  const document = window.document
  registerWindow(window, document)
  const canvas = SVG(document.documentElement)
  canvas.viewbox(0, 0, INVITE_WIDTH, INVITE_HEIGHT).width(INVITE_WIDTH).height(INVITE_HEIGHT)

  // Background
  canvas.rect(INVITE_WIDTH, INVITE_HEIGHT).radius(3).fill('#2f3136')

  // Server Icon
  let icon
  let iconCacheHit
  if (iconCache[invite.guild.icon]) {
    iconCacheHit = true
    icon = iconCache[invite.guild.icon]
  } else {
    iconCacheHit = false
    icon = await fetch(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}${invite.guild.icon.startsWith('a_') ? '.gif' : '.jpg'}`).then(res => res.buffer()).then(buffer => buffer.toString('base64'))
    iconCache[invite.guild.icon] = icon
  }
  const squircle = canvas.rect(ICON_SIZE, ICON_SIZE).radius(16).move(PADDING, INNER_Y).fill('#2f3136')
  const iconImage = canvas.image(`data:image/${invite.guild.icon.startsWith('a_') ? 'gif' : 'jpg'};base64,${icon}`).size(ICON_SIZE, ICON_SIZE).move(PADDING, 45)
  iconImage.clipWith(squircle)

  // Join button
  const joinButtonRect = canvas.rect(BUTTON_WIDTH, BUTTON_HEIGHT).radius(3).move(INVITE_WIDTH - PADDING - BUTTON_WIDTH, 50).fill('#43b581')
  const joinButtonText = canvas.path(whitneyMedium.getD(locale.button, { anchor: 'left top', fontSize: 14 })).fill('#ffffff')
  joinButtonText.move(joinButtonRect.x() + joinButtonRect.width()/2 - joinButtonText.width()/2, joinButtonRect.y() + joinButtonRect.height()/2 - joinButtonText.height()/2)

  // Header
  canvas.path(whitneyBold.getD(locale.header.toUpperCase(), { x: PADDING, y: PADDING, anchor: 'left top', fontSize: HEADER_SIZE })).fill('#b9bbbe')

  let EXTRA_NAME_PADDING = 0

  // Partner Badge
  if (invite.guild.features.includes('PARTNERED')) {
    canvas.path(Constants.SPECIAL_BADGE).move(INNER_X, INNER_Y).fill('#4087ed')
    canvas.path(Constants.PARTNER_ICON).move(INNER_X + Constants.PARTNER_ICON_X_OFFSET, INNER_Y + Constants.PARTNER_ICON_Y_OFFSET).fill('#ffffff')
    EXTRA_NAME_PADDING = PADDING + BADGE_MARGIN_RIGHT
  }

  // Verified Badge
  if (invite.guild.features.includes('VERIFIED')) {
    canvas.path(Constants.SPECIAL_BADGE).move(INNER_X, INNER_Y).fill('#7289da')
    canvas.path(Constants.VERIFIED_ICON).move(INNER_X + Constants.VERIFIED_ICON_X_OFFSET, INNER_Y + Constants.VERIFIED_ICON_Y_OFFSET).fill('#ffffff')
    EXTRA_NAME_PADDING = PADDING + BADGE_MARGIN_RIGHT
  }

  // Server Name
  canvas.path(whitneySemibold.getD(invite.guild.name, { anchor: 'left top', fontSize: SERVER_NAME_SIZE })).move(INNER_X + EXTRA_NAME_PADDING, INNER_Y).fill('#ffffff')

  // TODO: Align these correctly @metehus
  // Online and member counts
  const presenceCircle = canvas.circle(8).move(INNER_X, INNER_Y + SERVER_NAME_SIZE + 2).fill('#43b581')
  const presenceText = canvas.path(whitneySemibold.getD(locale.online.replace('{{count}}', invite.approximate_presence_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")), { x: INNER_X + 8, y: 16 + 12 + 12 + 30, anchor: 'left top', fontSize: 14 })).fill('#b9bbbe')
  canvas.path(whitneySemibold.getD(locale.members.replace('{{count}}', invite.approximate_member_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")), { x: INNER_X, y: 16 + 12 + 12 + 60, anchor: 'left top', fontSize: 14 })).fill('#b9bbbe')

  hrend = process.hrtime(hrstart)
  res.setHeader('X-Icon-Cache-Hit', iconCacheHit)
  res.setHeader('X-Invite-Cache-Hit', inviteCacheHit)
  res.setHeader('X-Render-Time', `${hrend[0]}s ${hrend[1] / 1000000}ms`)
  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(canvas.svg())
})

app.listen(PORT, () => {
  console.log(`Listening on post ${PORT}`)
})
