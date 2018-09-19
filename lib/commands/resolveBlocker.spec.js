jest.mock('../validation/rebounds')
jest.mock('../../model')
const resolveBlocker = require('./resolveBlocker')
const rebounds = require('../validation/rebounds')
const TaskTreeItem = require('../views/taskAndBlockerTreeItem')
const StoryInfoDataProvider = require('../views/storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')
const {model} = require('../../model')

const context = Context.build()
const storyInfoProvider = new StoryInfoDataProvider(context)
const taskTreeItem = new TaskTreeItem('My task', storyInfoProvider)

describe('#resolveBlocker', () => {
  it('should fail if taskTreeItem lacks an itemid', () => {
    resolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedResolveBlocker')
  })

  it('should refresh state view if update was successful', async () => {
    model.resolveBlocker.mockResolvedValue({res: {statusCode: 200}})
    taskTreeItem.taskOrBlockerContext = 'resolved-1'
    storyInfoProvider.refresh = jest.fn()
    await resolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('resolvedBlocker', context)
    expect(storyInfoProvider.refresh).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
  })

  it('should fail if resolveBlocker statuscode is not 200', async () => {
    model.resolveBlocker.mockResolvedValue({res: {statusCode: 201}})
    taskTreeItem.taskOrBlockerContext = 'complete-1'
    storyInfoProvider.refresh = jest.fn()
    await resolveBlocker(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedResolveBlocker')
    jest.clearAllMocks()
  })
})
