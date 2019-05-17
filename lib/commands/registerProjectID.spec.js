jest.mock('../../model/projects')
jest.mock('../validation/validate')
const PtProjects = require('../../model/projects')
const registerProjectID = require('./registerProjectID')
const Context = require('../../test/factories/vscode/context')
const {common} = require('../commands/common')
const vscode = require('vscode')
const {validate} = require('../validation/validate')

const context = Context.build()

describe('#registerProjectID', () => {
  beforeAll(() => {
    vscode.window.showErrorMessage = jest.fn().mockResolvedValue(undefined)
    vscode.window.showWarningMessage = jest.fn().mockResolvedValue(undefined)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('it fails to register if authentication fails', async () => {
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    const registered = await registerProjectID(context, {}, {})
    expect(registered).toBe(undefined)
  })

  test('it fails to register if no project is provided', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('')
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        data: [{id: 1, name: 'sample'}]
      })
    }))
    const registered = await registerProjectID(context, {}, {})
    expect(registered).toBe(undefined)
  })

  test('disposes subscriptions and marks workspace as not a project if user marks workspace as not a pt project', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('!This is not a Pivotal Tracker Project')
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        data: [{id: 1, name: 'sample'}]
      })
    }))
    const dispose = jest.fn().mockReturnValue(undefined)
    context.workspaceState.update = jest.fn().mockResolvedValue(true)
    context.subscriptions.push({dispose}, {dispose})
    await registerProjectID(context, {}, {})
    expect(dispose).toBeCalledTimes(context.subscriptions.length)
    expect(context.workspaceState.update).toBeCalledTimes(1)
    expect(context.workspaceState.update).toBeCalledWith(common.globals.notPTProject, true)
  })

  test('validates project id picked', async () => {
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        data: [{id: 1, name: 'sample'}]
      })
    }))
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('1 - sample')
    validate.mockImplementationOnce(() => new Promise((_resolve, reject) => reject(false)))
    await registerProjectID(context, {}, {})
    expect(validate).toBeCalledTimes(1)
  })
})
