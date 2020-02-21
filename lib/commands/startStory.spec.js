jest.mock('../../model/stories')
jest.mock('../validation/rebounds')
jest.mock('../views/storyInfo/storyInfoDataProvider')
jest.mock('../helpers/state', () => ({
  setState: jest.fn().mockResolvedValue(''),
  getState: () => ({
    story: '123'
  })
}))
jest.mock('../helpers/git')
const vscode = require('vscode')
const Chance = require('chance')
const PtStory = require('../../model/stories')
const rebounds = require('../validation/rebounds')
const startStory = require('./startStory')
const Context = require('../../test/factories/vscode/context')
const StoryInfoDataProvider = require('../views/storyInfo/storyInfoDataProvider')
const {setState} = require('../helpers/state')

const chance = new Chance()
let context = Context.build()

describe('#startStory', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('startStory', () => {
    test('test start story successfully', async () => {
      PtStory.mockImplementationOnce(() => ({
        updateStory: () => ({ res: { statusCode: 200 } })
      }))
      await startStory(context, new StoryInfoDataProvider(context))
      expect(rebounds.mock.calls[0][0]).toBe('startedStory')
    })

    test('refrehes story information view after successfully starting story', async () => {
      PtStory.mockImplementationOnce(() => ({
        updateStory: () => ({ res: { statusCode: 200 } })
      }))
      const StoryInfoProvider = new StoryInfoDataProvider(context)
      await startStory(context, StoryInfoProvider)
      expect(StoryInfoProvider.refresh).toHaveBeenCalledTimes(1)
    })

    test('fail to start story successfully', async () => {
      PtStory.mockImplementationOnce(() => ({
        updateStory: () => ({ res: { statusCode: 500 } })
      }))
      await startStory(context, new StoryInfoDataProvider(context))
      expect(rebounds.mock.calls[0][0]).toBe('failedStartStory')
    })

    test('fails to start if authentication fails', async () => {
      PtStory.mockImplementationOnce(() => ({
        updateStory: jest.fn().mockRejectedValue('invalid_authentication')
      }))
      await startStory(context, new StoryInfoDataProvider(context))
      expect(rebounds.mock.calls[0][0]).toBe('failedStartStory')
    })
  })

  describe('startStoryFromBacklogViewlet', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    
    afterAll(() => {
      context = Context.build()
    })

    const StoryInfoProvider = new StoryInfoDataProvider(context)

    const backlogTreeItem = {
      id: chance.string()
    }

    test('immediately starts story if workspace is not a repo', async () => {
      context.workspaceState.get = jest.fn(() => false)
      vscode.window.showQuickPick = jest.fn().mockResolvedValue(undefined)
      await startStory(context, StoryInfoProvider, backlogTreeItem)
      expect(vscode.window.showQuickPick).toHaveBeenCalledTimes(0)
      expect(PtStory.mock.instances[0].updateStory).toHaveBeenCalledTimes(1)
      expect(PtStory.mock.instances[0].updateStory).toHaveBeenCalledWith({current_state: 'started'})
    })

    test('shows failed to start story message if no option is picked and does not start story', async () => {
      context.workspaceState.get = jest.fn(() => true)
      vscode.window.showQuickPick = jest.fn().mockResolvedValue(undefined)
      await startStory(context, StoryInfoProvider, backlogTreeItem)
      expect(rebounds).toHaveBeenCalledTimes(1)
      expect(rebounds.mock.calls[0][0]).toBe('failedStartStory')
      expect(rebounds.mock.calls[0][2]).toBe('Could not start story')
      expect(PtStory.mock.instances).toHaveLength(0)
    })

    test('sets state with new branch name before starting story', async () => {
      context.workspaceState.get = jest.fn(() => false)
      await startStory(context, StoryInfoProvider, backlogTreeItem)
      expect(setState).toHaveBeenCalledTimes(1)
      expect(setState.mock.calls[0][1]).toBeFalsy()
      expect(setState.mock.calls[0][2]).toBe(backlogTreeItem.id)
    })

    test('does not start story if an error occurs', async () => {

    })
  })

  describe('Start story in current branch', () => {
    test('sets new branch to a falsy value', () => {

    })
  })

  describe('checkOutExistingBranch', () => {
    test('fails if branch is a default branch', async () => {

    })

    test('calls checkoutToBranch helper if a valid branch is picked', async () => {

    })

    test('returns branch picked',  async () => {

    })
  })

  describe('checkOutNewBranch', () => {
    test('does not accept an existing branch as an input', async () => {

    })

    test('fails if a new branch name is not entered', async () => {

    })

    test('calls checkoutFromBranch helper if a valid new branch and a base branch is picked', async () => {

    })

    test('returns branch picked',  async () => {

    })
  })
})
