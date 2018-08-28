const prepareUserCard = require('./prepareUserCard')
const Members = require('../../../test/factories/cycleTime/cycleTimeDetails')

const members = Members.build()

describe('#prepareUserCard', () => {
  it('should return card html string', () => {
    const card = prepareUserCard(members['user1'])
    expect(typeof card).toEqual('string')
  })
})
