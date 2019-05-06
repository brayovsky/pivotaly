const PtStory = require('../../model/stories')
const {getState} = require('../helpers/state')
const rebounds = require('../validation/rebounds')

exports.startStory = async context => {
  const storyId = getState(context).story
  const storyResource = new PtStory(context, storyId)
  let res
  try {
    res = (await storyResource.updateStory({current_state: 'started'})).res  
  } catch (error) {
    return rebounds('failedStartStory', context)    
  }
  if(res.statusCode === 200)
    return rebounds('startedStory', context)
  return rebounds('failedStartStory', context)
}
