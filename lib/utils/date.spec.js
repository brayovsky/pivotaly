const dateUtil = require('./date')
const moment = require('moment')

describe('#DateUtil', () => {
  describe('formatDate', () => {
    it('should format date according to moment format provided', () => {
      let formattedDate = dateUtil.formatDate('2018-08-14T12:01:00Z', 'YY')
      expect(formattedDate).toBe('18')
      formattedDate = dateUtil.formatDate('2018-08-14T12:01:00Z', 'MM-YY')
      expect(formattedDate).toBe('08-18')      
    })
  })

  describe('isBefore', () => {
    const timeToTest = moment().subtract(5, 'weeks')
    it('should return true if given time is before specified units ago', () => {
      const isTimeBefore = dateUtil.isBefore(timeToTest, 4, 'weeks')
      expect(isTimeBefore).toBe(true)
    })

    it('should return false if given time is before specified units ago', () => {
      const isTimeBefore = dateUtil.isBefore(timeToTest, 8, 'weeks')
      expect(isTimeBefore).toBe(false)
    })
  })
})
