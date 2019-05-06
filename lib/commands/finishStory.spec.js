jest.mock("../helpers/pivotaly")
jest.mock("../validation/rebounds")
jest.mock("../../model/stories")
const PtStory = require("../../model/stories")
const rebounds = require("../validation/rebounds")
const {getState} = require("../helpers/state")
const { finishStory } = require('./finishStory')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#finishStory', ()=> {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('finish story successfully', async () => {
    getState.mockReturnValue({isChore: true})
    PtStory.mockImplementationOnce(() => ({
      updateStory: () =>  ({ res: {statusCode: 200} })
    }))
    await finishStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('finishedStory')
  })
  test('failed to finish story successfully', async () => {
    getState.mockReturnValue({isChore: true})
    PtStory.mockImplementationOnce(() => ({
      updateStory: () =>  ({ res: {statusCode: 500} })
    }))
    await finishStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedFinishedStory')
  })
})
