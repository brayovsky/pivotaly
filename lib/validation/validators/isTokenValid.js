const {getStory} = require("../../../model/stories")

exports.isTokenValid = async function(context) {
  let storyStatusCode
  try{
    let story = await getStory(context, undefined)
    storyStatusCode = story.res.statusCode
  } catch(e) {
    storyStatusCode = e.res.statusCode
  } finally {
    return storyStatusCode != 403
  }
}
