jest.mock("../helpers/git")
jest.mock("../helpers/pivotaly")
jest.mock("../validation/validate")
jest.mock("../validation/rebounds")

const rebounds = require("../validation/rebounds")
const {getActiveBranch} = require("../helpers/git")
const {linkStory} = require('./linkStory')
const {validate} = require("../validation/validate")
const Context = require('../../test/factories/vscode/context')
const {getState} = require('../helpers/pivotaly')

const context = Context.build()

describe('#linkStory', () => {
  beforeEach(() => {
    getActiveBranch.mockReturnValue('activeBranch')
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should rebound linkedStory if successfully linked story', async () => {
    validate.mockReturnValueOnce(true)
    await linkStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('linkedStory')
  })
  it('should rebound failedLinkedStory if failed to link story', async () => {
    validate.mockReturnValueOnce(false)
    getState.mockReturnValue({branch: '', story: ''})
    await linkStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('failedLinkedStory')
  })
})
