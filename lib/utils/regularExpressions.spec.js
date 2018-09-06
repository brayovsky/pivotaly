const RegExpUtil = require('./regularExpressions')

describe('#RegExpUtil', () => {
  describe('testMatch', () => {
    it('should test a string against a provided regular expression', () => {
      let isTestValid = RegExpUtil.testMatch('wer', '^[a-zA-Z]+$')
      expect(isTestValid).toBe(true)
      isTestValid = RegExpUtil.testMatch('wer3', '^[a-zA-Z]+$')
      expect(isTestValid).toBe(false)
    })
  })

  describe('expressions', () => {
    it('should be an object with regular expressions', () => {
      expect(typeof RegExpUtil.expressions).toBe('object')
      for(const identifier in RegExpUtil.expressions) {
        if(RegExpUtil.expressions.hasOwnProperty(identifier))
          expect(typeof RegExpUtil.expressions[identifier]).toBe('string')
      }
    })
  })
})
