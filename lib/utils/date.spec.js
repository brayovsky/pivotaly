const dateUtil = require('./date')

describe('#DateFormatter', () => {
  describe('formatDate', () => {
    it('should format date according to moment format provided', () => {
      let formattedDate = dateUtil.formatDate('2018-08-14T12:01:00Z', 'YY')
      expect(formattedDate).toBe('18')
      formattedDate = dateUtil.formatDate('2018-08-14T12:01:00Z', 'MM-YY')
      expect(formattedDate).toBe('Aug-18')      
    })
  })
})
