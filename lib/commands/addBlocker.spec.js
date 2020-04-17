jest.mock('../validation/rebounds')
jest.mock('../../model/blockers')
jest.mock('../../model/iterations')
jest.mock('../helpers/state')
jest.mock('../adapters/generateQuickPickArray')
const vscode = require('vscode')
const addBlocker = require('./addBlocker')
const rebounds = require('../validation/rebounds')
const Blocker = require('../../model/blockers')
const {extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')


let taskTreeItem
describe('#addBlocker', () => {
  beforeEach(() => {
    rebounds.mockImplementation(jest.fn())
    taskTreeItem = {
      refresh: jest.fn(),
      itemId: 1
    }
  })

  afterEach(() => jest.clearAllMocks())

  test('should return undefined if no story blocker or description blocker is not is provided', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue(undefined)
    const added = await addBlocker({}, {})
    expect(added).toBe(undefined)
  })

  it('should return undefined if description is picked and not provided', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('Enter a blocker description')
    vscode.window.showInputBox = jest.fn().mockResolvedValue(undefined)
    const added = await addBlocker({}, {})
    expect(added).toBe(undefined)
  })



  test('should refresh view if blocker is created successfully', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('Enter a blocker description')
    vscode.window.showInputBox = jest.fn().mockResolvedValue('new blocker description')

    Blocker.mockImplementationOnce(() => ({
      createBlocker: jest.fn().mockResolvedValue({
        res: {
          statusCode: 200
        }
      })
    }))

    await addBlocker(taskTreeItem, {})
    expect(taskTreeItem.refresh).toBeCalledTimes(1)

  })

  test('should pick a story successfully', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('Pick a story blocker')
    extractIdFromQuickPick.mockImplementationOnce(() => 1)
    Blocker.mockImplementationOnce(() => ({
      createBlocker: jest.fn().mockResolvedValue({
        res: {
          statusCode: 200
        }
      })
    }))
    await addBlocker(taskTreeItem, {})
    expect(taskTreeItem.refresh).toBeCalledTimes(1)
  })

  test('should rebound with failedAddBlocker if an error occurrs', async () => {
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('Pick a story blocker')
    extractIdFromQuickPick.mockImplementationOnce(() => 1)
    Blocker.mockImplementationOnce(() => ({
      createBlocker: jest.fn().mockResolvedValue({
        res: {
          statusCode: 400
        }
      })
    }))
    await addBlocker(taskTreeItem, {})
    expect(rebounds).toBeCalledTimes(1)
    expect(rebounds).toBeCalledWith('failedAddBlocker')
  })
})
