const express = require('express')
const fetch = require('node-fetch')
const { repository } = require('./package.json')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.redirect(repository.url)
})

app.get('/:inviteCode', async (req, res) => {
  const inviteInfo = await fetch(`https://discordapp.com/api/v6/invites/${req.params.inviteCode}?with_counts=true`)
    .then(response => response.json())

  res.status(200).send(inviteInfo)
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

// var svg = require('svg-builder').width()