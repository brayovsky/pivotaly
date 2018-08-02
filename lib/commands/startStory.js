const {model} = require("../../model")
const {rebounds} = require("../validation/rebounds")

exports.startStory = async (context) => {
  const res = await model.updateState(context, 'started')
  if(res.res.statusCode === 200)
    return rebounds("startedStory", context)
  return rebounds("failedStartStory", context)
}
