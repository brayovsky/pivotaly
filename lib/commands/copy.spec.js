jest.mock('clipboardy')
jest.mock('../validation/rebounds')
const clipboardy = require('clipboardy')
const copy = require('./copy')
const rebounds = require('../validation/rebounds')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('copy', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should copy the string representation of an element', async () => {
    clipboardy.write.mockImplementationOnce(jest.fn().mockResolvedValue('success'))
    await copy(23, context)
    expect(clipboardy.write).toBeCalledTimes(1)
    expect(clipboardy.write).toBeCalledWith('23')
    expect(rebounds.mock.calls[0][0]).toBe('successCopy')
  })

  test('should copy an id property if it exists', async () => {
    clipboardy.write.mockImplementationOnce(jest.fn().mockResolvedValue('success'))
    await copy({id: 89}, context)
    expect(clipboardy.write).toBeCalledTimes(1)
    expect(clipboardy.write).toBeCalledWith('89')
    expect(rebounds.mock.calls[0][0]).toBe('successCopy')
  })

  test('should use toString method of an object if id does not exist', async () => {
    clipboardy.write.mockImplementationOnce(jest.fn().mockResolvedValue('success'))
    await copy({toString: () => 'this is me'}, context)
    expect(clipboardy.write).toBeCalledTimes(1)
    expect(clipboardy.write).toBeCalledWith('this is me')
    expect(rebounds.mock.calls[0][0]).toBe('successCopy')
  })

  test('should rebound to `failedCopy` if copying fails', async () => {
    clipboardy.write.mockImplementationOnce(jest.fn().mockRejectedValueOnce('err'))
    await copy({toString: () => 'this is me'}, context)
    expect(rebounds.mock.calls[0][0]).toBe('failedCopy')
  })
})