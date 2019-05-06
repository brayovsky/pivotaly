const PtStory = require('../../model/stories')
const {getState} = require('../helpers/state')
const rebounds = require('../validation/rebounds')

exports.startStory = async context => {
  const storyId = getState(context).story
  const storyResource = new PtStory(context, storyId)
  const {res} = await storyResource.updateStory({current_state: 'started'})
  if(res.statusCode === 200)
    return rebounds('startedStory', context)
  return rebounds('failedStartStory', context)
}
