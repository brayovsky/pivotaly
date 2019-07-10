const {getPlural} = require('./generalUtils')

describe('#generalUtils', () => {
  describe('getPlural', () => {
    it('should return string provided if count is 1', () => {
      expect(getPlural('dog', 1)).toBe('dog')
    })

    it('should append ies for strings ending in y and remove y if count is not 1', () => {
      expect(getPlural('doggy', 2)).toBe('doggies')
    })

    it('should append s for strings not ending in y if count is not 1', () => {
      expect(getPlural('dog', 2)).toBe('dogs')      
    })
  })
})