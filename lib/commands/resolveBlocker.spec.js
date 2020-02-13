jest.mock('../validation/rebounds')
jest.mock('../../model/blockers')
const resolveBlocker = require('./resolveBlocker')
const rebounds = require('../validation/rebounds')
const TaskTreeItem = require('../views/PivotalyTreeItem')
const StoryInfoDataProvider = require('../views/storyInfo/storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')
const PtBlocker = require('../../model/blockers')

const context = Context.build()
const storyInfoProvider = new StoryInfoDataProvider(context)
const taskTreeItem = new TaskTreeItem('My task', storyInfoProvider, 'item-1')

describe('#resolveBlocker', () => {
  it('should fail if taskTreeItem lacks an itemid', () => {
    const taskTree = new TaskTreeItem('My task', storyInfoProvider, 'item-1')
    delete taskTree.itemId
    resolveBlocker(taskTree, context)
    expect(rebounds).toBeCalledWith('failedResolveBlocker')
  })

  it('should refresh state view if update was successful', async () => {
    PtBlocker.mockImplementationOnce(() => ({
      updateBlocker: () => ({res: {statusCode: 200}})
    }))
    storyInfoProvider.refresh = jest.fn()
    await resolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('resolvedBlocker', context)
    expect(storyInfoProvider.refresh).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
  })

  it('should fail if resolveBlocker statuscode is not 200', async () => {
    PtBlocker.mockImplementationOnce(() => ({
      updateBlocker: () => ({res: {statusCode: 201}})
    }))
    storyInfoProvider.refresh = jest.fn()
    await resolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedResolveBlocker')
    jest.clearAllMocks()
  })

  it('should fail if authentication fails', async () => {
    PtBlocker.mockImplementationOnce(() => ({
      updateBlocker: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    await resolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedResolveBlocker')
  })
})
