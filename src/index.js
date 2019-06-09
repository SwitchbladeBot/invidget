const svg = require('svg-builder')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest (request) {
  var logo = svg.newInstance()
    .circle({
      r: 40,
      fill: 'none',
      'stroke-width': 1,
      stroke: '#CB3728',
      cx: 42,
      cy: 82
    }).circle({
      r: 40,
      fill: 'none',
      'stroke-width': 1,
      stroke: '#3B92BC',
      cx: 84,
      cy: 82
    }).text({
      x: 10,
      y: 20,
      'font-family': 'helvetica',
      'font-size': 15,
      stroke : '#fff',
      fill: '#fff'
    }, 'My logo').render()

  const response = new Response(logo)
  response.headers.set('Content-Type', 'image/svg+xml')

  return response
}
