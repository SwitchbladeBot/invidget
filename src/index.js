const window = require('svgdom')
const { SVG, registerWindow } = require('svg.js')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest (request) {
  // const inviteCode = new URL(request.url).searchParams.get('inviteCode') || 'Error'
  registerWindow(window, window.document)
  const canvas = SVG(window.document)
  canvas.rect(100, 100).fill('yellow').move(50, 50)
  const response = new Response(canvas.svg())
  response.headers.set('Content-Type', 'image/svg+xml')
  return response
}
