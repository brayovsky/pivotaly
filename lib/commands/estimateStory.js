const {window} = require('vscode')
const {getState, refreshState} = require('../helpers/state')
const PtStory = require('../../model/stories')
const rebound = require('../validation/rebounds')

module.exports = async (context, storyId, dataProvider) => {
  const state = getState(context)

  if(!state.projectDetails.point_scale) {
    rebound('estimateFailed', context, 'Could not find sufficient details about the project to provide a reliable points scale. Attempting to fetch')
    return refreshState(context)
  }

  const pointScale = state.projectDetails.point_scale.split(',')
  const estimate = await window.showQuickPick(pointScale, {
    placeHolder: 'Pick estimated points for the story'
  })

  if(!estimate || !parseFloat(estimate)) return

  const StoryResource = new PtStory(context, storyId)

  try {
    await StoryResource.updateStory({estimate: parseFloat(estimate)})
    await rebound('estimateSucceeded', context)
    dataProvider.refresh()
  } catch (e) {
    rebound('estimateFailed', context)
  }
}
