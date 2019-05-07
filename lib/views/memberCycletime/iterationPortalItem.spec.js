const iterationPortalItem = require('./iterationPortalItem')

const iteration = {
  start: '2017-08-14T12:01:00Z',
  finish: '2017-08-21T12:01:00Z',
  number: 25
}
const portalItem = new iterationPortalItem(iteration)

describe('#iterationPortalItem', () => {
  describe('_getYear', () => {
    it('should return year', () => {
      const year = portalItem._getYear(iteration.start)
      expect(year).toBe('2017')
    })
  })

  describe('_getMonth', () => {
    it('should return month', () => {
      const month = portalItem._getMonth(iteration.start)
      expect(month).toBe('August')
    })
  })
})
