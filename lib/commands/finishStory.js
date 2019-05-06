const PtStory = require('../../model/stories')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/state')

exports.finishStory = async context => {
  const state = getState(context)
  const newStoryState = state.isChore ? 'accepted' : 'finished'
  const storyResource = new PtStory(context, state.story)
  let res
  try {
    res = (await storyResource.updateStory({current_state: newStoryState})).res
  } catch (error) {
    return rebounds('failedFinishedStory', context)    
  }
  if(res.statusCode === 200)
    return rebounds('finishedStory', context)
  return rebounds('failedFinishedStory', context)
}
