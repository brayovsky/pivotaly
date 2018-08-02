const {model} = require("../../model")
const {rebounds} = require("../validation/rebounds")

exports.finishStory = async (context) => {
  const res = await model.updateState(context, 'finished')
  if(res.res.statusCode === 200)
    return rebounds("finishedStory", context)
  return rebounds("failedFinishedStory", context)
}
