const {model} = require("../../../model")

exports.isStoryIDValid = async (context, storyID) => {
  const story = await model.getStory(context, storyID)
  return story.res.statusCode === 200
}
