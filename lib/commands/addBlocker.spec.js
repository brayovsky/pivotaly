jest.mock('../validation/rebounds')
jest.mock('../../model/blockers')
jest.mock('../helpers/state')
const vscode = require('vscode')
const addBlocker = require('./addBlocker')
const rebounds = require('../validation/rebounds')
const Blocker = require('../../model/blockers')
const {getState} = require('../helpers/state')

let taskTreeItem
describe('#addBlocker', () => {
  beforeEach(() => {
    rebounds.mockImplementation(jest.fn())
    taskTreeItem = {
      dataProvider: {
        refresh: jest.fn()
      }
    }
    getState.mockReturnValue({story: 1})
  })

  afterEach(() => jest.clearAllMocks())

  test('should return undefined if no descriptions is provided', async () => {
    vscode.window.showInputBox = jest.fn().mockResolvedValue(undefined)
    const added = await addBlocker({}, {})
    expect(added).toBe(undefined)
  })

  test('should refresh view if blocker is created successfully', async () => {
    vscode.window.showInputBox = jest.fn().mockResolvedValue('new blocker description')

    Blocker.mockImplementationOnce(() => ({
      createBlocker: jest.fn().mockResolvedValue({
        res: {
          statusCode: 200
        }
      })
    }))

    await addBlocker(taskTreeItem, {})
    expect(taskTreeItem.dataProvider.refresh).toBeCalledTimes(1)

  })
})
