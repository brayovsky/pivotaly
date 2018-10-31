jest.mock('../../model/stories')
const pivotaly = require('./pivotaly')
const Context = require('../../test/factories/vscode/context')
const PtStory = require('../../model/stories')

const context = Context.build()

describe('#pivotaly.getState', () => {
  it('returns state', async () => {
    // ensure .get(state) was called
    const result = await pivotaly.getState(context)
    expect(result).toHaveProperty('branch')
    expect(result).toHaveProperty('story')
    expect(result).toHaveProperty('isChore')
  })
})

describe('#pivotaly.setState', () => {
  beforeAll(() => {
    PtStory.mockImplementation(() => ({
      getStory: () => ({data: {story_type: 'chore'}})
    }))
  })

  afterAll(() => jest.clearAllMocks())

  it('it should update set chore if branch and story are not provided', async () => {
    const result = await pivotaly.setState(context)
    const newState = JSON.parse(result)
    expect(newState).toHaveProperty('isChore', true)
  })

  it('should update all props given branch and story', async () => {
    const result = await pivotaly.setState(context, 'branch3', '125')
    const newState = JSON.parse(result)
    expect(newState).toHaveProperty('isChore', true)
    expect(newState).toHaveProperty('branch', 'branch3')
    expect(newState).toHaveProperty('story', '125')
    expect(newState).toHaveProperty('storyDetails')
  })
})

describe('#pivotaly.wipeState', () => {
  it('should set all properties to undefined', async () => {
    const newState = await pivotaly.wipeState(context)
    expect(newState).toBe('{}')
  })
})
