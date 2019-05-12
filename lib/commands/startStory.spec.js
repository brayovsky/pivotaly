jest.mock("../../model/stories")
jest.mock("../validation/rebounds")
const PtStory = require("../../model/stories")
const rebounds = require("../validation/rebounds")
const { startStory } = require('./startStory')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#startStory', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('test start story successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: () => ({ res: {statusCode: 200} })
    }))
    await startStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('startedStory')
  })
  test('test fail to start story successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: () => ({ res: {statusCode: 500} })
    }))
    await startStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedStartStory')
  })

  test('test fails to start if authentication fails', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    await startStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedStartStory')
  })
})
