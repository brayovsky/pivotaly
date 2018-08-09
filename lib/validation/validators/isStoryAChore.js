const model = require("../../../model")

module.exports = async (context, storyID) => {
  const story = await model.model.getStory(context, storyID, ["story_type"])
  return story.res.statusCode === 200 && story.data.story_type === "chore"
}
