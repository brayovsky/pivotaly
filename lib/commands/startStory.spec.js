jest.mock("../../model")
jest.mock("../validation/rebounds")
const {model} = require("../../model")
const {rebounds} = require("../validation/rebounds")
const { startStory } = require('./startStory')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#startStory', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('test start story successfully', async () => {
    model.updateState.mockReturnValue({ res: {statusCode: 200} })
    await startStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('startedStory')
  })
  test('test fail to start story successfully', async () => {
    model.updateState.mockReturnValue({ res: {statusCode: 500} })
    await startStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedStartStory')
  })
})
