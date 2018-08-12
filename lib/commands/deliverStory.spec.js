jest.mock("../../model")
jest.mock("../validation/rebounds")
const {model} = require("../../model")
const {rebounds} = require("../validation/rebounds")
const { deliverStory } = require('./deliverStory')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#deliverStory', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('test deliver story successfully', async () => {
    model.updateState.mockReturnValue({ res: {statusCode: 200} })
    await deliverStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('deliveredStory')
  })
  test('test fail to deliver story successfully', async () => {
    model.updateState.mockReturnValue({ res: {statusCode: 500} })
    await deliverStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedDeliveredStory')
  })
})
