jest.mock('../validation/rebounds')
jest.mock('../../model/tasks')
const deliverTask = require('./deliverTask')
const rebounds = require('../validation/rebounds')
const TaskTreeItem = require('../views/taskAndBlockerTreeItem')
const StoryInfoDataProvider = require('../views/storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')
const PtTasks = require('../../model/tasks')

const context = Context.build()
const storyInfoProvider = new StoryInfoDataProvider(context)
const taskTreeItem = new TaskTreeItem('My task', storyInfoProvider)

describe('#deliverTask', () => {
  it('should fail if taskTreeItem lacks an itemid', () => {
    deliverTask(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedDeliveredTask')
  })

  it('should refresh state view if update was successful', async () => {
    PtTasks.mockImplementationOnce(() => ({
      updateTask: () => ({res: {statusCode: 200}})
    }))
    taskTreeItem.taskOrBlockerContext = 'complete-1'
    storyInfoProvider.refresh = jest.fn()
    await deliverTask(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('deliveredTask', context)
    expect(storyInfoProvider.refresh).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
  })

  it('should fail if deliverTask statuscode is not 200', async () => {
    PtTasks.mockImplementationOnce(() => ({
      updateTask: () => ({res: {statusCode: 201}})
    }))
    taskTreeItem.taskOrBlockerContext = 'complete-1'
    storyInfoProvider.refresh = jest.fn()
    await deliverTask(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedDeliveredTask')
    jest.clearAllMocks()
  })
})
