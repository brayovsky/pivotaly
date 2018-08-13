jest.mock("../../model")
jest.mock("../validation/rebounds")
const {model} = require("../../model")
const {rebounds} = require("../validation/rebounds")
const { stopStory } = require('./stopStory')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#stopStory', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('test stop story successfully', async () => {
    model.updateState.mockReturnValue({ res: {statusCode: 200} })
    await stopStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('unstartedStory')
  })
  test('test fail to stop story successfully', async () => {
    model.updateState.mockReturnValue({ res: {statusCode: 500} })
    await stopStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedUnstartStory')
  })
})