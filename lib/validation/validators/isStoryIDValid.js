const model = require('../../../model/index')

exports.isStoryIDValid = async (context, storyID) => {
  const story = await model.model.getStory(context, storyID, ["id"])
  return story.res.statusCode === 200
}
