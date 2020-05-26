const express = require('express')
const app = express()
const sharp = require('sharp')
const winston = require('winston')
const morgan = require('morgan')
const PORT = process.env.PORT || 80

const InviteRenderer = require('./InviteRenderer.js')

const logger = winston.createLogger()

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({ level: process.env.LOGGING_LEVEL || 'silly' }))
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}${info.label ? ` [${info.label || ''}]` : ''}: ${info.message}`
      )
    ),
    level: process.env.LOGGING_LEVEL || 'silly'
  }))
}

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim(), { label: 'HTTP' }) } }))

app.get('/svg/:inviteCode', async (req, res) => {
  logger.info(`Rendering ${req.params.inviteCode} as SVG`, { label: 'Renderer' })
  const hrstart = process.hrtime()
  const inviteSVG = await InviteRenderer.render(req.params.inviteCode, req.query.language)
  const hrend = process.hrtime(hrstart)
  res.setHeader('X-Render-Time', `${hrend[0]}s ${hrend[1] / 1000000}ms`)
  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(inviteSVG)
  logger.info(`Took ${hrend[0]}s ${hrend[1] / 1000000}ms to render ${req.params.inviteCode} as SVG`, { label: 'Renderer' })
})

app.get('/png/:inviteCode', async (req, res) => {
  logger.info(`Rendering ${req.params.inviteCode} as PNG`, { label: 'Renderer' })
  const hrstart = process.hrtime()
  const inviteSVG = await InviteRenderer.render(req.params.inviteCode, req.query.language, false)
  const invitePNG = await sharp(Buffer.from(inviteSVG)).png({ compressionLevel: 0 }).toBuffer()
  const hrend = process.hrtime(hrstart)
  res.setHeader('X-Render-Time', `${hrend[0]}s ${hrend[1] / 1000000}ms`)
  res.setHeader('Content-Type', 'image/png')
  res.send(invitePNG)
  logger.info(`Took ${hrend[0]}s ${hrend[1] / 1000000}ms to render ${req.params.inviteCode} as PNG`, { label: 'Renderer' })
})

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`, { label: 'HTTP' })
})
