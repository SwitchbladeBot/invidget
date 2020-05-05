const express = require('express')
const app = express()

const svgdom = require('svgdom')
const { SVG, registerWindow } = require('@svgdotjs/svg.js')

const window = svgdom.createSVGWindow()
const document = window.document

registerWindow(window, document)

const strings = require('./strings.json')
const PORT = process.env.PORT || 8080

app.get('/svg/:inviteCode', function (req, res) {
  const canvas = SVG(document.documentElement)
  canvas.rect(430, 110).radius(3).fill('#2f3136')
  canvas.rect(50, 50).radius(15).move(15, 45).fill('#ffffff')
  canvas.rect(95, 40).radius(3).move(320, 50).fill('#43b581')
  canvas.text(strings.pt.header.toUpperCase()).fill('#ffffff')

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(canvas.svg())
})

app.listen(PORT, function () {
  console.log(`Listening on post ${PORT}`)
})