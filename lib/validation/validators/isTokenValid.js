const PtStory = require('../../../model/stories')

exports.isTokenValid = async (context) => {
  const storyResource = new PtStory(context, undefined)
  const storyDetails = await storyResource.getStory()
  const storyStatusCode = storyDetails.res.statusCode
  return storyStatusCode != 403
}
