<div align="center">
  <img src="https://svgshare.com/i/NvW.svg" height="80"/>
  <br>
  <br>
  
  [![ci][ci-badge]][ci-url]
  [![backers][backers-badge]][backers-url]
  [![sponsors][sponsors-badge]][sponsors-url]
  [![docker][docker-badge]][docker-url]
</div>

<hr>

**invidget** generates SVG renders of Discord invites that can be used in GitHub READMEs or even websites. These are a great way to increase conversions and get more people to join your server.

### Base URL:
```
http://invidget.switchblade.xyz/YOUR_INVITE_CODE
```

## Preview

### Dark theme (default)

![Dark theme preview](http://invidget.switchblade.xyz/2FB8wDG)

### Light theme `?theme=light`

![Light theme preview](http://invidget.switchblade.xyz/2FB8wDG?theme=light)

### Different language `?language=pt`

![Light theme preview](http://invidget.switchblade.xyz/2FB8wDG?language=pt)

**⚠ THIS PROJECT IS A WIP!**

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
- [x] Light Theme (`?theme=light`)
- [x] Winston Logging
- [x] Sentry Error Reporting
- [x] Handle invites from servers without icons
  - [ ] Render the acronym
- [ ] Redis Caching
- [ ] Handle invites from servers with emojis in their names
- [ ] Handle expired/invalid invites (do the same thing that Discord does)
- [ ] Handle text overflow

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

## Sponsors

Sponsors are organizations and companies that contribute to our projects with money. They get their logo with a link to their website on our READMEs! [Click here and become a sponsor today!][sponsors-url]

<a href="https://opencollective.com/switchblade/sponsor/0/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/0/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/1/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/1/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/2/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/2/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/3/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/3/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/4/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/4/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/5/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/5/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/6/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/6/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/7/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/7/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/8/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/8/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/9/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/9/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/sponsor/10/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/sponsor/10/avatar.svg?requireActive=false"></a>

## Backers

Backers are the people who contribute to our projects monetarily. They get their image with a link to their website on our READMEs, an awesome badge on their Switchblade profile and a role that grants exclusive access to some channels in our discord server. [Click here and become a backer today!][backers-url]

<a href="https://opencollective.com/switchblade/backer/0/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/0/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/1/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/1/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/2/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/2/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/3/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/3/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/4/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/4/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/5/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/5/avatar.svg?requireActive=false&a=1"></a>
<a href="https://opencollective.com/switchblade/backer/6/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/6/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/7/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/7/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/8/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/8/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/9/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/9/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/switchblade/backer/10/website?requireActive=false" target="_blank"><img src="https://opencollective.com/switchblade/backer/10/avatar.svg?requireActive=false"></a>

[ci-badge]: https://github.com/SwitchbladeBot/invidget/workflows/CI/badge.svg
[ci-url]: https://github.com/SwitchbladeBot/invidget/actions?query=workflow%3ACI

[backers-url]: https://opencollective.com/switchblade#backer
[backers-badge]: https://opencollective.com/switchblade/tiers/backer/badge.svg?label=backers&color=brightgreen

[sponsors-url]: https://opencollective.com/switchblade#sponsor
[sponsors-badge]: https://opencollective.com/switchblade/tiers/sponsor/badge.svg?label=sponsors&color=brightgreen

[docker-url]: https://hub.docker.com/r/switchbladebot/invidget
[docker-badge]:https://img.shields.io/docker/pulls/switchbladebot/invidget