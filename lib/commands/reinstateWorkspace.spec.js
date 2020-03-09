const vscode = require('vscode')
const reinstateWorkspace = require('./reinstateWorkspace')
const {common} = require('./common')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#reinstateWorkspace', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should set workspace as a pt project', () => {
    context.workspaceState.update = jest.fn()
    reinstateWorkspace(context)
    expect(context.workspaceState.update).toBeCalledTimes(1)
    expect(context.workspaceState.update).toBeCalledWith(common.globals.notPTProject, false)
  })

  test('it should reload window', () => {
    const reloadCommand = 'workbench.action.reloadWindow'
    reinstateWorkspace(context)
    expect(vscode.commands.executeCommand).toBeCalledTimes(1)
    expect(vscode.commands.executeCommand).toBeCalledWith(reloadCommand)
  })
})
