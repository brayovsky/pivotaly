const Model = require('./')
const Context = require('../test/factories/vscode/context')

const context = Context.build()
context.globalState = {
  get: jest.fn().mockReturnValue('val')
}

describe('#model', () => {
  const model = new Model(context)
  describe('_addParams', () => {
    test('it should add params as expected', () => {
      const urlWithParams = model._addParams('www.myurl.com', {q: 2, track: '123'})
      expect(urlWithParams).toBe('www.myurl.com?q=2&track=123')
    })

    test('it should return original path if no ', () => {
      const urlWithParams = model._addParams('www.myurl.com', {})
      expect(urlWithParams).toBe('www.myurl.com')
    })

    test('it should remove trailing slashes', () => {
      const urlWithParams = model._addParams('www.myurl.com/', {q: 2, track: '123'})
      expect(urlWithParams).toBe('www.myurl.com?q=2&track=123')
    })
  })
})
