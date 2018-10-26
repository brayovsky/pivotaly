const {PtStory} = require('../../model')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/pivotaly')

exports.finishStory = async (context) => {
  const state = getState(context)
  const newStoryState = state.isChore ? 'accepted' : 'finished'
  const storyResource = new PtStory(context, state.story)
  const {res} = await storyResource.updateStory({current_state: newStoryState})
  if(res.statusCode === 200)
    return rebounds('finishedStory', context)
  return rebounds('failedFinishedStory', context)
}
