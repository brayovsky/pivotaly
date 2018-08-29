const prepareUserCard = require('./prepareUserCard')
const Members = require('../../../test/factories/cycleTime/cycleTimeDetails')

const members = Members.build()

describe('#prepareUserCard', () => {
  it('should return card html string', () => {
    const card = prepareUserCard(members['user1'])
    expect(typeof card).toEqual('string')
  })

  it('should return a div element', () => {
    const card = prepareUserCard(members['user1'])
    const div = '<div'
    const offset = div.length
    expect(card.slice(0, offset)).toEqual(div)
  })
})
