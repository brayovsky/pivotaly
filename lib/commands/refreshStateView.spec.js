jest.mock('../helpers/pivotaly')
const refreshStateView = require('./refreshStateView')
const StateInfoDataProvider = require('../views/storyInfo/storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')
const ptlyHelpers = require('../helpers/state')

const context = Context.build()

describe('#refreshStateView', () => {
  it('should call refresh method of the state view data provider', async () => {
    ptlyHelpers.getState.mockReturnValue({storyDetails: {}})
    const StoryInfoProvider = new StateInfoDataProvider(context)
    StoryInfoProvider.refresh = jest.fn()
    await refreshStateView(context, StoryInfoProvider)
    expect(StoryInfoProvider.refresh).toHaveBeenCalledTimes(1)
  })
})
