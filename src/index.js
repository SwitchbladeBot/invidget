// Sentry Error Reporting
const Sentry = require('@sentry/node')
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

// DataDog Tracing
const tracer = require('dd-trace')
tracer.init({
  env: process.env.NODE_ENV,
  logInjection: true
}).use('winston').use('express')

const winston = require('winston')
const express = require('express')
const morgan = require('morgan')
const PORT = process.env.PORT || 80

const InviteRenderer = require('./InviteRenderer.js')
const InviteResolver = require('./InviteResolver')

const app = express()

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

app.use(Sentry.Handlers.requestHandler())
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim(), { label: 'HTTP' }) } }))

app.get('/:query', async (req, res) => {
  logger.info(`Got request to render ${req.params.query}`)
  const inviteCode = await InviteResolver.resolve(req.params.query)
  logger.info(`Rendering ${inviteCode}`, { label: 'Renderer' })
  const inviteSVG = await InviteRenderer.render(inviteCode, req.query)
  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(inviteSVG)
})

app.use(Sentry.Handlers.errorHandler())

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`, { label: 'HTTP' })
})
