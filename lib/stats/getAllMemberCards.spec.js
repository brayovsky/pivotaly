jest.mock('../stats/templates/prepareUserCard')
const getAllMemberCards = require('./getAllMemberCards')
const Members = require('../../test/factories/cycleTime/cycleTimeDetails')
const prepareUserCard = require('../stats/templates/prepareUserCard')

const members = Members.build()

describe('#getAllMemberCards', () => {
  afterAll(() => jest.clearAllMocks())

  it('should return a string', () => {
    const cards = getAllMemberCards(members)
    expect(typeof cards).toEqual('string')
  })

  it('should prepare each card and join them', () => {
    const card = '<div> </div>'
    prepareUserCard.mockReturnValue(card)
    const memberCount = Object.keys(members).length
    const cards = getAllMemberCards(members)
    expect(cards).toEqual(card.repeat(memberCount))
  })
})
