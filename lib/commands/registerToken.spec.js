jest.mock('../validation/validate')
jest.mock('../helpers/workspace')
const vscode = require('vscode')
const registerToken = require('./registerToken')
const Context = require('../../test/factories/vscode/context')
const {validate} = require('../validation/validate')
const {commands} = require('../commands/commands')
const {executeCommands} = require('../helpers/workspace')

const context = Context.build()

describe('#registerToken', () => {
  beforeAll(() => {
    vscode.window.showWarningMessage = jest.fn().mockResolvedValue(undefined)
    vscode.window.showInformationMessage = jest.fn().mockResolvedValue(undefined)

    context.globalState = {
      get: jest.fn().mockReturnValue('prevToken'),
      update: jest.fn().mockResolvedValue(true)
    }
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
    validate.mockRejectedValueOnce(false)
    vscode.window.showInputBox = jest.fn().mockResolvedValue('token')

    
    await registerToken(context)
    expect(validate).toBeCalledTimes(1)
    expect(context.globalState.update).toBeCalledTimes(2)
    expect(vscode.window.showWarningMessage).toBeCalledWith('Invalid token. Make sure you have copied the right value')
  })

  describe('On success', () => {
    beforeAll(() => {
      vscode.window.showInputBox.mockResolvedValue('token')
      validate.mockResolvedValue(true)
    })

    test('should attempt to validate both token and projectID', async () => {
      await registerToken(context)
      expect(validate).toBeCalledTimes(2)
      expect(validate.mock.calls[0][0]).toBe('token')
      expect(validate.mock.calls[1][0]).toBe('projectID')
    })

    test('should attempt to link a story, refresh member cycle and refresh backlog after successfully registering token', async () => {
      await registerToken(context)
      expect(executeCommands).toBeCalledWith(
        commands.workState.linkStory,
        commands.storyState.refreshMemberCycleView,
        commands.storyState.refreshBacklog
      )
    })
  })
})
