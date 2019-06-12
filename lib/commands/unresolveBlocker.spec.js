jest.mock('../validation/rebounds')
jest.mock('../../model/blockers')
const unresolveBlocker = require('./unresolveBlocker')
const rebounds = require('../validation/rebounds')
const TaskTreeItem = require('../views/storyInfo/taskAndBlockerTreeItem')
const StoryInfoDataProvider = require('../views/storyInfo/storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')
const PtBlocker = require('../../model/blockers')

const context = Context.build()
const storyInfoProvider = new StoryInfoDataProvider(context)
const taskTreeItem = new TaskTreeItem('My task', storyInfoProvider, 'item-1')

describe('#unresolveBlocker', () => {
  it('should fail if taskTreeItem lacks an itemid', () => {
    const taskTree = new TaskTreeItem('My task', storyInfoProvider, 'item-1')
    delete taskTree.itemId
    unresolveBlocker(taskTree, context)
    expect(rebounds).toBeCalledWith('failedUnresolveBlocker')
  })

  it('should refresh state view if update was successful', async () => {
    PtBlocker.mockImplementationOnce(() => ({
      updateBlocker: () => ({res: {statusCode: 200}})
    }))
    taskTreeItem.taskOrBlockerContext = 'resolved-1'
    storyInfoProvider.refresh = jest.fn()
    await unresolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('unresolvedBlocker', context)
    expect(storyInfoProvider.refresh).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
  })

  it('should fail if unresolveBlocker statuscode is not 200', async () => {
    PtBlocker.mockImplementationOnce(() => ({
      updateBlocker: () => ({res: {statusCode: 201}})
    }))
    taskTreeItem.taskOrBlockerContext = 'complete-1'
    storyInfoProvider.refresh = jest.fn()
    await unresolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedUnresolveBlocker')
    jest.clearAllMocks()
  })

  it('test fails to undeliver if authentication fails', async () => {
    PtBlocker.mockImplementationOnce(() => ({
      updateBlocker: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    await unresolveBlocker(context)
    expect(rebounds).toBeCalledWith('failedUnresolveBlocker')
  })
})
