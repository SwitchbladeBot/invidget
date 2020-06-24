const strings = require('../strings.json')
const ISO6391 = require('iso-639-1')

test('languages should be in alphabetical order', () => {
  expect(Object.keys(strings)).toStrictEqual(Object.keys(strings).sort())
})

test('language codes should be in ISO 639-1 format', () => {
  expect(ISO6391.getAllCodes()).toEqual(expect.arrayContaining(Object.keys(strings)))
})
