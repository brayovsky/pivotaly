jest.mock('../../model/stories')
const state = require('./state')
const Context = require('../../test/factories/vscode/context')
const PtStory = require('../../model/stories')

const context = Context.build()

describe('#state.getState', () => {
  it('returns state', async () => {
    // ensure .get(state) was called
    const result = await state.getState(context)
    expect(result).toHaveProperty('branch')
    expect(result).toHaveProperty('story')
    expect(result).toHaveProperty('isChore')
  })
})

describe('#state.setState', () => {
  beforeAll(() => {
    PtStory.mockImplementation(() => ({
      getStory: () => ({data: {story_type: 'chore'}})
    }))
  })

  afterAll(() => jest.clearAllMocks())

  it('it should update set chore if branch and story are not provided', async () => {
    const result = await state.setState(context)
    const newState = JSON.parse(result)
    expect(newState).toHaveProperty('isChore', true)
  })

  it('should update all props given branch and story', async () => {
    const result = await state.setState(context, 'branch3', '125')
    const newState = JSON.parse(result)
    expect(newState).toHaveProperty('isChore', true)
    expect(newState).toHaveProperty('branch', 'branch3')
    expect(newState).toHaveProperty('story', '125')
    expect(newState).toHaveProperty('storyDetails')
  })

  it('should set default chore and storyDetails if authentication fails', async () => {
    PtStory.mockImplementation(() => ({
      getStory: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    const saveState = await state.setState(context, 'branch3', '125')
    console.log(saveState)
    const newState = JSON.parse(saveState)
    expect(newState).toHaveProperty('isChore', false)
    expect(newState).toHaveProperty('branch', 'branch3')
    expect(newState).toHaveProperty('story', '125')
    expect({}).toMatchObject(newState.storyDetails)
  })  
})

describe('#state.wipeState', () => {
  it('should set all properties to undefined', async () => {
    const newState = await state.wipeState(context)
    expect(newState).toBe('{}')
  })
})
