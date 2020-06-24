const Discord = require('../Discord.js')

test('getIconUrl should return the right format', () => {
  expect(Discord.getIconUrl('445203868624748555', 'a_86ff43bc6e6f1be2d351c3d174d24446')).toEqual(expect.stringMatching(/.gif$/))
  expect(Discord.getIconUrl('445203868624748555', '86ff43bc6e6f1be2d351c3d174d24446')).toEqual(expect.stringMatching(/.jpg$/))
})
