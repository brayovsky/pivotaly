const getAllKeys = require('./getAllKeys')

describe('#getAllKeys', () => {
  it('should return an array of all keys of an object', () => {
    const obj = {a: 'foo', b: 'bar'}
    const allKeys = getAllKeys(obj)
    expect(allKeys.length).toBe(2)
    expect(allKeys).toContain('a')
    expect(allKeys).toContain('b')
  })
})
