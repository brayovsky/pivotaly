jest.mock('../../model/stories')
jest.mock('../validation/rebounds')
jest.mock('./finishStory')
jest.mock('../helpers/state')
const PtStory = require('../../model/stories')
const rebounds = require('../validation/rebounds')
const { deliverStory } = require('./deliverStory')
const Context = require('../../test/factories/vscode/context')
const {finishStory} = require('./finishStory')
const {getState} = require('../helpers/state')

const context = Context.build()

describe('#deliverStory', () => {
  beforeEach(() => {
    getState.mockImplementationOnce(() => ({
      isChore: false,
      story: 4
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  test('test deliver story successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: () => ({res: {statusCode: 200}})
    }))
    await deliverStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('deliveredStory')
  })
  test('test fail to deliver story successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: () => ({res: {statusCode: 500}})
    }))
    await deliverStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedDeliveredStory')
  })

  test('test fails to deliver if authentication fails', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    await deliverStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedDeliveredStory')
  })

  it('finishes chore if story is a chore', async () => {
    getState.mockReset()
    getState.mockImplementation(() => ({
      isChore: true,
      story: 24
    }))
    await deliverStory(context)
    expect(finishStory).toBeCalledTimes(1)
  })
})
