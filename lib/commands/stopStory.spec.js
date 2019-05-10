jest.mock("../validation/rebounds")
jest.mock('../../model/stories')
const PtStory = require('../../model/stories')
const rebounds = require("../validation/rebounds")
const { stopStory } = require('./stopStory')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#stopStory', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('test stop story successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
        updateStory: () => ({ res: {statusCode: 200} })
      })
    )
    await stopStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('unstartedStory')
  })
  test('test fail to stop story successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: () => ({ res: {statusCode: 500} })
    })
  )
    await stopStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedUnstartStory')
  })

  test('test fails to stop if authentication fails', async () => {
    PtStory.mockImplementationOnce(() => ({
      updateStory: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    await stopStory(context)
    expect(rebounds).toBeCalledWith('failedUnstartStory')
  })
})
