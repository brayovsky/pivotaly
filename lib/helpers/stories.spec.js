jest.mock("../validation/validators/isStoryIDValid")
const {isStoryIDValid} = require("../validation/validators/isStoryIDValid")
const {getStoryID} = require('./stories')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#pivotaly getStoryId', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('get post story id successfully', async () => {
    isStoryIDValid.mockReturnValueOnce(true)
    const result = await getStoryID(context, 'post-story-id-54324')
    expect(result).toEqual('54324')
  })
  it('get pre story id successfully', async () => {
    isStoryIDValid.mockReturnValueOnce(false).mockReturnValueOnce(true)
    const result = await getStoryID(context, '27343-pre-story-id')
    expect(result).toEqual('27343')
  })
  it('Fail to get post or pre story id', async () => {
    isStoryIDValid.mockReturnValueOnce(false).mockReturnValueOnce(false)
    const result = await getStoryID(context, 'story')
    expect(typeof result).toEqual('undefined')
  })
})
