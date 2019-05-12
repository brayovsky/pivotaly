jest.mock('../validation/rebounds')
jest.mock('../../model/tasks')
const deliverTask = require('./deliverTask')
const rebounds = require('../validation/rebounds')
const TaskTreeItem = require('../views/storyInfo/taskAndBlockerTreeItem')
const StoryInfoDataProvider = require('../views/storyInfo/storyInfoDataProvider')
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

  describe('deliverTask with mocks', () => {
    afterEach(() => {
      jest.clearAllMocks()
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
    })
  
    it('should fail if deliverTask statuscode is not 200', async () => {
      PtTasks.mockImplementationOnce(() => ({
        updateTask: () => ({res: {statusCode: 201}})
      }))
      taskTreeItem.taskOrBlockerContext = 'complete-1'
      storyInfoProvider.refresh = jest.fn()
      await deliverTask(taskTreeItem, context)
      expect(rebounds).toBeCalledWith('failedDeliveredTask')
    })
  
    test('test fails to deliver if authentication fails', async () => {
      PtTasks.mockImplementationOnce(() => ({
        updateTask: jest.fn().mockRejectedValue('invalid_authentication')
      }))
      taskTreeItem.taskOrBlockerContext = 'complete-1'
      storyInfoProvider.refresh = jest.fn()
      await deliverTask(taskTreeItem, context)
      expect(rebounds).toBeCalledWith('failedDeliveredTask')
    })
  })
})
