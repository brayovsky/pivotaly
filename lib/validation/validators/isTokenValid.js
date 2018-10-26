const {PtStory} = require('../../../model')

exports.isTokenValid = async function(context) {
  const storyResource = new PtStory(context, undefined)
  const storyDetails = await storyResource.getStory()
  const storyStatusCode = storyDetails.res.statusCode
  return storyStatusCode != 403
}
