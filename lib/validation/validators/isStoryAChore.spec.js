jest.mock('../../../model/stories')
const isStoryAChore = require('./isStoryAChore')
const PtStory = require('../../../model/stories')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

describe('#isStoryAChore', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should return true if story type is a chore', async () => {
    PtStory.mockImplementationOnce(() => ({
      getStory: jest.fn().mockResolvedValue({
        data: {
          story_type: 'chore'
        },
        res: {
          statusCode: 200
        }
      })
    }))
    const isChore = await isStoryAChore(context, 1)
    expect(isChore).toBe(true)
  })

  test('it should return false if status code is not 200', async () => {
    PtStory.mockImplementationOnce(() => ({
      getStory: jest.fn().mockResolvedValue({
        res: {
          statusCode: 400
        }
      })
    }))
    const isChore = await isStoryAChore(context, 1)
    expect(isChore).toBe(false)
  })

  test('it should return false if story type is not a chore', async () => {
    PtStory.mockImplementationOnce(() => ({
      getStory: jest.fn().mockResolvedValue({
        data: {
          story_type: 'feature'
        },
        res: {
          statusCode: 200
        }
      })
    }))
    const isChore = await isStoryAChore(context, 1)
    expect(isChore).toBe(false)
  })

  test('it should return false if authentication fails', async () => {
    PtStory.mockImplementationOnce(() => ({
      getStory: jest.fn().mockRejectedValue('invalid_credentials')
    }))
    const isChore = await isStoryAChore(context, 1)
    expect(isChore).toBe(false)
  })
})
