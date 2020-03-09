jest.mock('../../model/projects')
jest.mock('../validation/validate')
jest.mock('../helpers/workspace')
const PtProjects = require('../../model/projects')
const registerProjectID = require('./registerProjectID')
const Context = require('../../test/factories/vscode/context')
const {commands} = require('../commands/commands')
const vscode = require('vscode')
const {validate} = require('../validation/validate')
const {setUpNotPtProjectEnvironment, executeCommands} = require('../helpers/workspace')

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
    const registered = await registerProjectID(context)
    expect(registered).toBe(undefined)
    expect(vscode.window.showErrorMessage).toBeCalledWith('Could not fetch projects')
  })

  test('it fails to register if no project is provided', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('')
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        data: [{id: 1, name: 'sample'}]
      })
    }))
    const registered = await registerProjectID(context)
    expect(registered).toBe(undefined)
  })

  test('marks workspace as not a project if user marks workspace as not a pt project', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('!This is not a Pivotal Tracker Project')
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        data: [{id: 1, name: 'sample'}]
      })
    }))
    await registerProjectID(context)
    expect(setUpNotPtProjectEnvironment).toBeCalledTimes(1)
    expect(setUpNotPtProjectEnvironment.mock.calls[0][1]).toBe(true)
  })

  test('validates project id picked', async () => {
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        data: [{id: 1, name: 'sample'}]
      })
    }))
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('1 - sample')
    validate.mockImplementationOnce(() => new Promise((_resolve, reject) => reject(false)))
    await registerProjectID(context)
    expect(validate).toBeCalledTimes(1)
  })

  describe('On success', () => {
    beforeAll(() => {
      PtProjects.mockImplementation(() => ({
        getAllProjects: jest.fn().mockResolvedValue({
          data: [{id: 1, name: 'sample'}]
        })
      }))
      vscode.window.showQuickPick = jest.fn().mockResolvedValue('1 - sample')
      validate.mockResolvedValue(true)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should attempt to link a story, refresh member cycle and refresh backlog after successfully registering project ID', async () => {
      await registerProjectID(context)
      expect(executeCommands).toBeCalledWith(
        commands.workState.linkStory,
        commands.storyState.refreshMemberCycleView,
        commands.storyState.refreshBacklog
      )
    })
  })
})
