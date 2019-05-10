jest.mock('../../../model/stories')
const {isStoryIDValid} = require('./isStoryIDValid')
const PtStory = require('../../../model/stories')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

describe('#isStoryIDValid', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should return true if story can be fetched successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
      getStory: jest.fn().mockResolvedValue({
        res: {
          statusCode: 200
        }
      })
    }))
    const isValid = await isStoryIDValid(context, 1)
    expect(isValid).toBe(true)
  })

  test('it should return fasle if story cannot be fetched successfully', async () => {
    PtStory.mockImplementationOnce(() => ({
      getStory: jest.fn().mockResolvedValue({
        res: {
          statusCode: 404
        }
      })
    }))
    const isValid = await isStoryIDValid(context, 1)
    expect(isValid).toBe(false)
  })

  test('it should return false if authentication failed', async () => {
    PtStory.mockImplementationOnce(() => ({
      getStory: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    const isValid = await isStoryIDValid(context, 1)
    expect(isValid).toBe(false)
  })
})
