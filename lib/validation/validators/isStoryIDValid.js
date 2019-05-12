const PtStory = require('../../../model/stories')
const {getState} = require('../../helpers/state')

exports.isStoryIDValid = async (context, storyId = null) => {
  const validStoryId = storyId || getState(context).story
  const storyResource = new PtStory(context, validStoryId)
  let storyDetails
  try {
    storyDetails = await storyResource.getStory(['id'])
  } catch (error) {
    return false
  }
  return storyDetails.res.statusCode === 200
}
