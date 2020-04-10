jest.mock('../validation/rebounds')
const {env} = require('vscode')
const copy = require('./copy')
const rebounds = require('../validation/rebounds')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('copy', () => {
  env.clipboard.writeText.mockResolvedValue('success')

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should copy the string representation of an element', async () => {
    await copy(23, context)
    expect(env.clipboard.writeText).toBeCalledTimes(1)
    expect(env.clipboard.writeText).toBeCalledWith('23')
    expect(rebounds.mock.calls[0][0]).toBe('successCopy')
  })

  test('should copy an id property if it exists', async () => {
    await copy({id: 89}, context)
    expect(env.clipboard.writeText).toBeCalledTimes(1)
    expect(env.clipboard.writeText).toBeCalledWith('89')
    expect(rebounds.mock.calls[0][0]).toBe('successCopy')
  })

  test('should use toString method of an object if id does not exist', async () => {
    await copy({toString: () => 'this is me'}, context)
    expect(env.clipboard.writeText).toBeCalledTimes(1)
    expect(env.clipboard.writeText).toBeCalledWith('this is me')
    expect(rebounds.mock.calls[0][0]).toBe('successCopy')
  })

  test('should rebound to `failedCopy` if copying fails', async () => {
    env.clipboard.writeText.mockImplementationOnce(jest.fn().mockRejectedValueOnce('err'))
    await copy({toString: () => 'this is me'}, context)
    expect(rebounds.mock.calls[0][0]).toBe('failedCopy')
  })
})
