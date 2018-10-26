const {PtStory} = require('../../../model')

module.exports = async (context, storyId) => {
  const storyResource = new PtStory(context, storyId)
  const storyDetails = await storyResource.getStory(['story_type'])
  return storyDetails.res.statusCode === 200 && storyDetails.data.story_type === "chore"
}
