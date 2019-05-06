const PtStory = require('../../../model/stories')

module.exports = async (context, storyId) => {
  const storyResource = new PtStory(context, storyId)
  let storyDetails
  try {
    storyDetails = await storyResource.getStory(['story_type'])    
  } catch (error) {
    return false
  }
  return storyDetails.res.statusCode === 200 && storyDetails.data.story_type === "chore"
}
