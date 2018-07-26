const {model} = require("../../../model")

exports.isTokenValid = async function(context) {
  let storyStatusCode
  try{
    let story = await model.getStory(context, undefined)
    storyStatusCode = story.res.statusCode
  } catch(e) {
    storyStatusCode = e.res.statusCode
  } finally {
    return storyStatusCode != 403
  }
}
