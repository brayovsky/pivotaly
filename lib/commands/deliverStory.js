const PtStory = require('../../model/stories')
const {getState} = require('../helpers/state')
const rebounds = require('../validation/rebounds')

exports.deliverStory = async context => {
  const storyId = getState(context).story
  const storyResource = new PtStory(context, storyId)
  let res
  try{
    res = (await storyResource.updateStory({current_state: 'delivered'})).res
  } catch(e) {
    return rebounds('failedDeliveredStory', context)
  }
  if(res.statusCode === 200)
    return rebounds('deliveredStory', context)
  return rebounds('failedDeliveredStory', context)
}
