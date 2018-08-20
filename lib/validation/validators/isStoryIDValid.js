const {model} = require('../../../model/index')
const {getState} = require('../../helpers/pivotaly')

exports.isStoryIDValid = async (context, storyID = null) => {
  const story = storyID ? await model.getStory(context, storyID, ["id"]) :
    await model.getStory(context, getState(context).story, ["id"])
  return story.res.statusCode === 200
}
