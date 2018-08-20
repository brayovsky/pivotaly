jest.mock("../validation/validators/isStoryAChore")
const isStoryAChore = require("../validation/validators/isStoryAChore")
const {getState, setState} = require('./pivotaly')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#pivotaly getState', () => {
  it('returns state', async () => {
    // ensure .get(state) was called
    const result = await getState(context)
    expect(result).toHaveProperty('branch')
    expect(result).toHaveProperty('story')
    expect(result).toHaveProperty('isChore')
  })
})

describe('#pivotaly setState', () => {
  it('it should update set chore if branch and story are not provided', async () => {
    isStoryAChore.mockReturnValueOnce(true)
    const result = await setState(context)
    const newState = JSON.parse(result)
    expect(newState).toHaveProperty('isChore', true)
  })

  it('should update all props given branch and story', async () => {
    isStoryAChore.mockReturnValueOnce(true)
    const result = await setState(context, 'branch3', '125')
    const newState = JSON.parse(result)
    expect(newState).toHaveProperty('isChore', true)
    expect(newState).toHaveProperty('branch', 'branch3')
    expect(newState).toHaveProperty('story', '125')
  })
})
