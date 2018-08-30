const createDoc = require('./createDoc')

describe('#createDoc', () => {
  it('should return a string', () => {
    const htmlDoc = createDoc('foo', 'bar')
    expect(typeof htmlDoc).toEqual('string')
  })

  it('should return a html document string', () => {
    const htmlDeclaration = '<!DOCTYPE html>'
    const offset = htmlDeclaration.length
    const doc = createDoc('data', 'css')
    expect(doc.slice(0, offset)).toEqual(htmlDeclaration)
  })
})
