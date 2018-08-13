jest.mock("../helpers/git")
jest.mock("../helpers/pivotaly")
jest.mock("../validation/validate")
jest.mock("../validation/rebounds")
const {rebounds} = require("../validation/rebounds")
const {getActiveBranch} = require("../helpers/git")
const {linkStory} = require('./linkStory')
const {validate} = require("../validation/validate")
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#linkStory', () => {
  beforeEach(() => {
    getActiveBranch.mockReturnValue('activeBranch')
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('successfully link story', async () => {
    validate.mockReturnValueOnce(true)
    await linkStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('linkedStory')
  })
  it('fail to link story', async () => {
    validate.mockReturnValueOnce(false)
    await linkStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedLinkedStory')
  })
})