const getAllMemberCards = require('./getAllMemberCards')
const Members = require('../../test/factories/cycleTime/cycleTimeDetails')

const members = Members.build()

describe('#getAllMemberCards', () => {
  it('should return a string', () => {
    const cards = getAllMemberCards(members)
    expect(typeof cards).toEqual('string')
  })
})
