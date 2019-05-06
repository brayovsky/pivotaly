const PtStory = require('../../model/stories')
const {getState} = require('../helpers/state')
const rebounds = require('../validation/rebounds')

exports.stopStory = async context => {
  const storyId = getState(context).story
  const storyResource = new PtStory(context, storyId)
  let res
  try {
    res = (await storyResource.updateStory({current_state: 'unstarted'})).res
  } catch (error) {
    return rebounds('failedUnstartStory', context)    
  }
  if(res.statusCode === 200)
    return rebounds('unstartedStory', context)
  return rebounds('failedUnstartStory', context)
}
