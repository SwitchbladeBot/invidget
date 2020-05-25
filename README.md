# invidget

SVG invite widgets that look just like the ones on the Discord client!

![Widget Preview](https://camo.githubusercontent.com/1bedc6155f548ad05dc36165a8cc22fb2e932bf1/687474703a2f2f34352e33332e32372e3230383a383038302f7376672f324642387744473f6c616e67756167653d656e)

**⚠ THIS PROJECT IS WIP!**

## Planned features

- [x] Unit Tests
  - [x] Code Style
  - [x] strings.json
    - [x] ISO 639-1 language codes
    - [x] Alphabetical Order
- [x] Generate and serve SVGs
- [x] Make the SVG look like the discord invite widget
- [x] Automatically build and push to Docker Hub through GitHub Actions
- [x] Watch for `src` changes and restart automatically for development
- [ ] Light Theme (`?theme=light`)
- [ ] Handle invites from servers without icons
- [ ] Redis Caching
- [ ] Handle invites from servers with emojis in their names
- [ ] Handle expired/invalid invites (do the same thing that Discord does)
- [ ] Handle text overflow
- [ ] Winston Logging
- [ ] Sentry Error Reporting

## Setting up a development environment

- Clone this repo
- `npm install`
- Run `npm run dev` to get the development server up
- Access it through http://localhost:8080/

## String guidelines

- Language codes should be in [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) format
- Languages should be in alphabetical order in the .json
- If Discord supports the language you're adding, strings should perfectly match the ones on the client (capitalization too!)
- [Check if your JSON is valid](https://jsonlint.com/)
