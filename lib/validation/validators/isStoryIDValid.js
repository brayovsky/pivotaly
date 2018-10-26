const PtStory = require('../../../model/stories')
const {getState} = require('../../helpers/pivotaly')

exports.isStoryIDValid = async (context, storyId = null) => {
  const validStoryId = storyId || getState(context).story
  const storyResource = new PtStory(context, validStoryId)
  const storyDetails = await storyResource.getStory(['id'])
  return storyDetails.res.statusCode === 200
}
