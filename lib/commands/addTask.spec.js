jest.mock('../validation/rebounds')
jest.mock('../../model/tasks')
jest.mock('../helpers/state')
const vscode = require('vscode')
const addTask = require('./addTask')
const rebounds = require('../validation/rebounds')
const Task = require('../../model/tasks')

let taskTreeItem
describe('#addBlocker', () => {
  beforeEach(() => {
    rebounds.mockImplementation(jest.fn())
    taskTreeItem = {
      dataProvider: {
        refresh: jest.fn()
      },
      itemId: 1
    }
  })

  afterEach(() => jest.clearAllMocks())

  test('should return undefined if no descriptions is provided', async () => {
    vscode.window.showInputBox = jest.fn().mockResolvedValue(undefined)
    const added = await addTask({}, {})
    expect(added).toBe(undefined)
  })

  test('should refresh view if task is created successfully', async () => {
    vscode.window.showInputBox = jest.fn().mockResolvedValue('new task description')

    Task.mockImplementationOnce(() => ({
      createTask: jest.fn().mockResolvedValue({
        res: {
          statusCode: 200
        }
      })
    }))

    await addTask(taskTreeItem, {})
    expect(taskTreeItem.dataProvider.refresh).toBeCalledTimes(1)
  })
})
