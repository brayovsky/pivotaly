jest.mock('../../model/stories')
jest.mock('../../model/projects')
const state = require('./state')
const Context = require('../../test/factories/vscode/context')
const PtStory = require('../../model/stories')
const PtProject = require('../../model/projects')
const {common} = require('../commands/common')
const Chance = require('chance')

const context = Context.build()
const chance = new Chance()

context.workspaceState.get = jest.fn(() => JSON.stringify({
  exState: chance.string()
}))

context.workspaceState.update = jest.fn(() => JSON.stringify({
  exState: chance.string()
}))


describe('#state.getState', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns state', async () => {
    await state.getState(context)
    expect(context.workspaceState.get).toBeCalledTimes(1)
    expect(context.workspaceState.get.mock.calls[0][0]).toBe(common.globals.state)
  })
})

describe('#state.setState', () => {

  afterEach(() => jest.clearAllMocks())

  it('it should not update if branch and story are not provided', async () => {
    await state.setState(context)
    expect(context.workspaceState.update).not.toHaveBeenCalled()
  })

  it('should update state all given branch and story', async () => {
    await state.setState(context, chance.string(), chance.string())
    expect(context.workspaceState.update).toHaveBeenCalledTimes(1)
  })

  it('should set default chore and storyDetails if fetching story details fails', async () => {
    await state.setState(context, chance.string(), chance.string())

    const stateArgument = JSON.parse(context.workspaceState.update.mock.calls[0][1])

    expect(stateArgument.isChore).toBe(false)
    expect(stateArgument.storyDetails).toMatchObject({})
  })

  it('Should attempt to fetch story details', async () => {
    await state.setState(context, chance.string(), chance.string())

    expect(PtStory.mock.instances[0].getStory).toBeCalledTimes(1)
  })
})

describe('#state.wipeState', () => {
  afterEach(() => jest.clearAllMocks())

  it('should update state with default props', async () => {
    await state.wipeState(context)
    const stateArgument = JSON.parse(context.workspaceState.update.mock.calls[0][1])
    expect(stateArgument.branch).toBe('')
    expect(stateArgument.story).toBe('')
    expect(stateArgument.isChore).toBe(false)
    expect(stateArgument.projectDetails).toMatchObject({})
    expect(stateArgument.storyDetails).toMatchObject({})
  })
})

describe('#state.refreshState', () => {
  afterEach(() => jest.clearAllMocks())

  it('should fetch project details and store the data', async () => {
    await state.refreshState(context)

    expect(PtProject.mock.instances[0].getProject).toBeCalledTimes(1)
  })

  it('should set project details to a default value if an error occurs', async () => {
    // simulated type error
    await state.refreshState(context)
    const stateArgument = JSON.parse(context.workspaceState.update.mock.calls[0][1])

    expect(stateArgument.projectDetails).toMatchObject({})
  })

  it('should call setState', async () => {
    context.workspaceState.get = jest.fn(() => JSON.stringify({
      exState: chance.string(),
      branch: chance.string(),
      story: chance.string()
    }))

    await state.refreshState(context)

    expect(PtStory.mock.instances[0].getStory).toBeCalledTimes(1)
  })
})
