const createDoc = require('./createDoc')

describe('#createDoc', () => {
  it('should return a string', () => {
    const htmlDoc = createDoc('foo', 'bar')
    expect(typeof htmlDoc).toEqual('string')
  })
})
