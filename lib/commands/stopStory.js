const {model} = require("../../model")
const {rebounds} = require("../validation/rebounds")

exports.stopStory = async (context) => {
  const res = await model.updateState(context, 'unstarted')
  if(res.res.statusCode === 200)
    return rebounds("unstartedStory", context)
  return rebounds("failedUnstartStory", context)
}
