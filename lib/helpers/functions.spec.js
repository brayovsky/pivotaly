const { isFunctionAsync } = require('./functions')

describe('#functions', () => {
  test('test if function is async', () => {
    expect(isFunctionAsync(async () => {})).toBeTruthy()
  })
  test('test if function is not async', () => {
    expect(isFunctionAsync(() => {})).toBeFalsy()
  })

})