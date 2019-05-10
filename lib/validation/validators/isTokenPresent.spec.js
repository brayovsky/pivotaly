const {isTokenPresent} = require('./isTokenPresent')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

describe('#isTokenPresent', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should return false if token is not present', async () => {
    context.globalState = {
      get: jest.fn().mockReturnValue(null)
    }
    const isPresent = await isTokenPresent(context)
    expect(isPresent).toBe(false)
  })

  test('it should return true if token is present', async () => {
    context.globalState = {
      get: jest.fn().mockReturnValue('aw2345')
    }
    const isPresent = await isTokenPresent(context)
    expect(isPresent).toBe(true)
  })
})
