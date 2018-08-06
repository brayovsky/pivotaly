const model = require('../../../model/index')
const ptHelpers = require('../../helpers/pivotaly')

exports.isStoryIDValid = async (context, storyID = null) => {
  const story = storyID ? await model.model.getStory(context, storyID, ["id"]) :
    await model.model.getStory(context, ptHelpers.getState(context).story, ["id"])
  return story.res.statusCode === 200
}
