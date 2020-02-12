jest.mock('../validation/rebounds')
jest.mock('../../model/tasks')
const undeliverTask = require('./undeliverTask')
const rebounds = require('../validation/rebounds')
const TaskTreeItem = require('../views/PivotalyTreeItem')
const StoryInfoDataProvider = require('../views/storyInfo/storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')
const PtTask = require('../../model/tasks')

const context = Context.build()
const storyInfoProvider = new StoryInfoDataProvider(context)
const taskTreeItem = new TaskTreeItem('My task', storyInfoProvider, 'item-1')

describe('#undeliverTask', () => {
  afterEach(() => jest.clearAllMocks())

  it('should fail if taskTreeItem lacks an itemid', () => {
    const taskTree = new TaskTreeItem('My task', storyInfoProvider, 'item-1')
    delete taskTree.itemId
    undeliverTask(taskTree, context)
    expect(rebounds).toBeCalledWith('failedundeliveredTask')
  })

  it('should refresh state view if update was successful', async () => {
    PtTask.mockImplementationOnce(() => ({
      updateTask: () => ({res: {statusCode: 200}})
    }))
    storyInfoProvider.refresh = jest.fn()
    await undeliverTask(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('undeliveredTask', context)
    expect(storyInfoProvider.refresh).toHaveBeenCalledTimes(1)
  })

  it('should fail if undeliverTask statuscode is not 200', async () => {
    PtTask.mockImplementationOnce(() => ({
      updateTask: () => ({res: {statusCode: 201}})
    }))
    storyInfoProvider.refresh = jest.fn()
    await undeliverTask(taskTreeItem, context)
    expect(rebounds).toBeCalledWith('failedundeliveredTask')
  })

  test('test fails to undeliver if authentication fails', async () => {
    PtTask.mockImplementationOnce(() => ({
      updateTask: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    await undeliverTask(context)
    expect(rebounds).toBeCalledWith('failedundeliveredTask')
  })
})
