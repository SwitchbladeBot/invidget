const svg = require('svg-builder')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest (request) {
  var logo = svg.newInstance()
    .text({
      x: 10,
      y: 20,
      'font-family': 'helvetica',
      'font-size': 15,
      stroke: '#000',
      fill: '#000'
    }, 'invidget').render()

  const response = new Response(logo)
  response.headers.set('Content-Type', 'image/svg+xml')

  return response
}
