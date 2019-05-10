jest.mock('../validation/validate')
const vscode = require('vscode')
const registerToken = require('./registerToken')
const Context = require('../../test/factories/vscode/context')
const {validate} = require('../validation/validate')

const context = Context.build()

describe('#registerToken', () => {
  beforeAll(() => {
    vscode.window.showWarningMessage = jest.fn().mockResolvedValue(undefined)
    vscode.window.showInformationMessage = jest.fn().mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('it should not register if no token is provided', async () => {
    vscode.window.showInputBox = jest.fn().mockResolvedValue('')
    const registered = await registerToken(context)
    expect(registered).toBeUndefined()
  })

  test('it should validate token put', async () => {
    validate.mockImplementationOnce(() => new Promise((_resolve, reject) => reject(false)))
    vscode.window.showInputBox = jest.fn().mockResolvedValue('token')

    context.globalState = {
      get: jest.fn().mockReturnValue('prevToken'),
      update: jest.fn().mockReturnValue(true)
    }
    await registerToken(context)
    expect(validate).toBeCalledTimes(1)
    expect(context.globalState.update).toBeCalledTimes(2)
  })
})
