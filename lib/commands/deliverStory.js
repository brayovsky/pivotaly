const {PtStory} = require('../../model')
const {getState} = require('../helpers/pivotaly')
const rebounds = require('../validation/rebounds')

exports.deliverStory = async context => {
  const storyId = getState(context).story
  const storyResource = new PtStory(context, storyId)
  const {res} = await storyResource.updateStory({current_state: 'delivered'})
  if(res.statusCode === 200)
    return rebounds('deliveredStory', context)
  return rebounds('failedDeliveredStory', context)
}
