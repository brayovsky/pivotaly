const PtStory = require('../../model/stories')
const {getState} = require('../helpers/pivotaly')
const rebounds = require('../validation/rebounds')

exports.stopStory = async context => {
  const storyId = getState(context).story
  const storyResource = new PtStory(context, storyId)
  const {res} = await storyResource.updateStory({current_state: 'unstarted'})
  if(res.statusCode === 200)
    return rebounds('unstartedStory', context)
  return rebounds('failedUnstartStory', context)
}
