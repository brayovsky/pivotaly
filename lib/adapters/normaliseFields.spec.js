const normalise = require('./normaliseFields')

describe('#normaliseFields', () => {
  it('return array if data is not array', () => {
    expect(normalise.normaliseFields('1,2,3')).toEqual(["1", "2", "3"])
  })
  it('return array if data is array', () => {
    expect(normalise.normaliseFields([1,2,3])).toEqual([1,2,3])
  })
})