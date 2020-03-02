jest.mock('../helpers/state')
jest.mock('../../model/stories')
jest.mock('../views/storyInfo/storyInfoDataProvider')
jest.mock('../validation/rebounds')
const vscode = require('vscode')
const Chance = require('chance')
const {getState, refreshState} = require('../helpers/state')
const PtStory = require('../../model/stories')
const StoryInfoDataProvider = require('../views/storyInfo/storyInfoDataProvider')
const estimateStory = require('./estimateStory')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()
const StoryInfoProvider = new StoryInfoDataProvider(context)
const chance = new Chance()

describe('#estimateStory', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should refreshState if point_scale is unavailable', async () => {
    getState.mockImplementationOnce(() => ({
      story: chance.string(),
      projectDetails: {}
    }))

    await estimateStory(context, StoryInfoProvider)

    expect(refreshState).toBeCalledTimes(1)
    expect(PtStory).not.toBeCalled()
  })

  test('Should return if an estimate is not provided', async () => {
    getState.mockImplementation(() => ({
      story: chance.string(),
      projectDetails: {
        point_scale: '1,2'
      }
    }))

    vscode.window.showQuickPick = jest.fn().mockResolvedValue(undefined)

    await estimateStory(context, StoryInfoProvider)
    expect(PtStory).not.toBeCalled()
  })

  describe('Successful quick picks', () => {
    beforeAll(() => {
      getState.mockImplementation(() => ({
        story: chance.string(),
        projectDetails: {
          point_scale: '1,2'
        }
      }))

      vscode.window.showQuickPick = jest.fn().mockResolvedValue('2')
    })

    test('Should update story with estimate provided as a float', async () => {
      await estimateStory(context, StoryInfoProvider)
  
      expect(PtStory.mock.instances[0].updateStory).toBeCalledTimes(1)
      expect(PtStory.mock.instances[0].updateStory).toBeCalledWith({estimate: 2.0})
    })

    test('Should refresh provider passed to it if estimation is successful', async () => {
      await estimateStory(context, StoryInfoProvider)
  
      expect(StoryInfoProvider.refresh).toBeCalledTimes(1)
    })
  })

  test('Should rebound with `estimateFailed` if estimation is unsuccessful', async () => {
    jest.resetModules()

    jest.doMock('../../model/stories', () => {
      return function() {
        this.updateStory = jest.fn().mockRejectedValue('ENOTFOUND')
      }
    })
    jest.mock('../helpers/state')
    jest.mock('../validation/rebounds')
    const {getState} = require('../helpers/state')
    const vscode = require('vscode')
    const estimateStory = require('./estimateStory')
    const rebounds = require('../validation/rebounds')

    getState.mockImplementationOnce(() => ({
      story: chance.string(),
      projectDetails: {
        point_scale: '1,2'
      }
    }))

    vscode.window.showQuickPick = jest.fn().mockResolvedValue('2')

    await estimateStory(context, StoryInfoProvider)

    expect(rebounds).toBeCalledTimes(1)
    expect(rebounds.mock.calls[0][0]).toBe('estimateFailed')
  })
})
