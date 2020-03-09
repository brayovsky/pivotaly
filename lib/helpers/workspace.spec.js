jest.mock('../views/controlPanel/cpDataProvider')
const vscode = require('vscode')
const Context = require('../../test/factories/vscode/context')
const {setUpNotPtProjectEnvironment} = require('./workspace')
const {common} = require('../commands/common')
const ControlPanelDataProvider = require('../views/controlPanel/cpDataProvider')

const context = Context.build()

describe('#workspace', () => {
  beforeAll(() => {
    vscode.window.registerTreeDataProvider = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should mark workspace as not a Pt project if workspace was a pt project', async () => {
    context.workspaceState.update = jest.fn()
    await setUpNotPtProjectEnvironment(context, true)
    expect(context.workspaceState.update).toBeCalledTimes(1)
    expect(context.workspaceState.update).toBeCalledWith(common.globals.notPTProject, true)
  })

  test('should dispose all disposables in subscriptions array', async () => {
    const dispose = jest.fn()
    context.subscriptions = [{dispose},{dispose}]
    await setUpNotPtProjectEnvironment(context, false)
    expect(dispose).toBeCalledTimes(2)
  })

  test('should create a new control panel data provider for a non-pt workspace', async () => {
    context.subscriptions = []
    await setUpNotPtProjectEnvironment(context, false)
    expect(ControlPanelDataProvider).toBeCalledTimes(1)
    expect(ControlPanelDataProvider.mock.calls[0][3]).toBe(false)
  })
})
