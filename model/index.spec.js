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
    test('it should rebound to network if no connection is available', async () => {
      clients.createJsonClient.mockReturnValue({
        get: (params, cb) => {
          cb({code: 'ENOTFOUND'})
        }
      })
      const model = new Model(context)

      model.callApi('get', '')
      expect(rebounds).toHaveBeenCalledTimes(1)
      expect(rebounds).toHaveBeenCalledWith('network', context)
    })

    test('it should rebound to token if authentication fails', async () => {
      clients.createJsonClient.mockReturnValue({
        get: (params, cb) => {
          cb({
            statusCode: 403,
            restCode: 'invalid_authentication'
          })
        }
      })
      const model = new Model(context)

      model.callApi('get', '')
      expect(rebounds).toHaveBeenCalledTimes(1)
      expect(rebounds).toHaveBeenCalledWith('token', context)
    })
  })
})
