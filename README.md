# invidget

SVG invite widgets that look just like the ones on the Discord client!

![Widget Preview](http://45.33.27.208:8080/svg/2FB8wDG?language=en)

**⚠ THIS PROJECT IS WIP!**

## Planned features

- [ ] Unit Tests
  - [ ] Code Style
  - [ ] strings.json
    - [ ] JSON lint
    - [ ] ISO 639-1 language codes
    - [ ] Required strings exist
- [x] Generate and serve SVGs
- [ ] Make the SVG look like the discord invite widget
- [ ] Automatically build and push to Docker Hub through GitHub Actions
- [x] Watch for `src` changes and restart automatically for development

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
