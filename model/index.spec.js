const clients = require('restify-clients')
const Model = require('./')
const Context = require('../test/factories/vscode/context')
const rebounds = require('./rebounds')

const context = Context.build()
context.globalState = {
  get: jest.fn().mockReturnValue('val')
}

jest.mock('restify-clients')
jest.mock('./rebounds')

describe('#model', () => {
  afterEach(() => jest.clearAllMocks())

  describe('_addParams', () => {
    const model = new Model(context)
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

  describe('callApi', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    test('it should rebound with error object if an error occurrs', async () => {
      const errObject = {code: 'ENOTFOUND'}
      clients.createJsonClient.mockReturnValue({
        get: (params, cb) => {
          cb(errObject)
        }
      })
      const model = new Model(context)

      rebounds.mockResolvedValue(false)
      try {
        await model.callApi('get', '')
      } catch(e) {
        expect(rebounds).toHaveBeenCalledTimes(1)
        expect(rebounds).toHaveBeenCalledWith(errObject, context)
        expect(e).toBe('ENOTFOUND')
      }
    })

    test('it should retry specified number of times if a rebound returns true', async () => {
      const errObject = {restCode: 'invalid_authentication'}
      clients.createJsonClient.mockReturnValue({
        get: (params, cb) => {
          cb(errObject)
        }
      })
      rebounds.mockResolvedValue(true)
      const model = new Model(context)
      try {
        await model.callApi('get', '')
      } catch (e) {
        expect(rebounds).toHaveBeenCalledTimes(model.retryLimit)
        expect(e).toBe('invalid_authentication')
      }
    })
  })
})
