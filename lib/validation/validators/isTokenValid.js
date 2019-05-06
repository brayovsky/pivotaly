const PtStory = require('../../../model/stories')

exports.isTokenValid = async context => {
  const storyResource = new PtStory(context, undefined)
  let storyDetails
  try {
    storyDetails = await storyResource.getStory()
  } catch(e) {
    return false
  }
  const storyStatusCode = storyDetails.res.statusCode
  return storyStatusCode != 403
}
