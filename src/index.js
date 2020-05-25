const express = require('express')
const app = express()
const sharp = require('sharp')
const PORT = process.env.PORT || 80

const InviteRenderer = require('./InviteRenderer.js')

app.get('/svg/:inviteCode', async (req, res) => {
  const hrstart = process.hrtime()
  const inviteSVG = await InviteRenderer.render(req.params.inviteCode, req.query.language)
  const hrend = process.hrtime(hrstart)
  res.setHeader('X-Render-Time', `${hrend[0]}s ${hrend[1] / 1000000}ms`)
  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(inviteSVG)
})

app.get('/png/:inviteCode', async (req, res) => {
  const hrstart = process.hrtime()
  const inviteSVG = await InviteRenderer.render(req.params.inviteCode, req.query.language, false)
  const invitePNG = await sharp(Buffer.from(inviteSVG)).png({ compressionLevel: 0 }).toBuffer()
  const hrend = process.hrtime(hrstart)
  res.setHeader('X-Render-Time', `${hrend[0]}s ${hrend[1] / 1000000}ms`)
  res.setHeader('Content-Type', 'image/png')
  res.send(invitePNG)
})

app.listen(PORT, () => {
  console.log(`Listening on post ${PORT}`)
})
