jest.mock('../helpers/state')
const vscode = require('vscode')
const showAllCommands = require('./showAllCommands')
const stateHelper = require('../helpers/state')
const Context = require('../../test/factories/vscode/context')

const storyInfoProvider = {
  refresh: jest.fn()
}
const context = Context.build()

describe('#showAllCommands', () => {
  afterEach(() => jest.clearAllMocks())

  beforeEach(() => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('$(triangle-right)\tStart Story')
  })

  test('should show all commands if a story is available', async () => {
    stateHelper.getState.mockReturnValue({
      story: 123,
      storyDetails: {
        name: 'test story'
      }
    })
    await showAllCommands(context, storyInfoProvider)
    const expectedCommands = ['$(triangle-right)\tStart Story', '$(primitive-square)\tStop Story', '$(check)\tFinish Story', '$(briefcase)\tDeliver Story', '$(link)\tLink Story']
    const calledCommands = vscode.window.showQuickPick.mock.calls[0][0]
    expect(expectedCommands).toMatchObject(calledCommands)
  })

  test('should show a subset of commands if story is unavailable', async () => {
    stateHelper.getState.mockReturnValue({
      story: undefined
    })
    await showAllCommands(context, storyInfoProvider)
    const expectedCommands = ['$(link)\tLink Story']
    const calledCommands = vscode.window.showQuickPick.mock.calls[0][0]
    expect(expectedCommands).toMatchObject(calledCommands)
  })

  test('should execute picked command', async () => {
    stateHelper.getState.mockReturnValue({
      story: 123,
      storyDetails: {
        name: 'test story'
      }
    })
    await showAllCommands(context, storyInfoProvider)
    expect(vscode.commands.executeCommand).toBeCalledTimes(1)
    expect(vscode.commands.executeCommand.mock.calls[0][0]).toBe('pivotaly.startStory')
    expect(vscode.commands.executeCommand.mock.calls[0][1]).toMatchObject(context)
  })
})
