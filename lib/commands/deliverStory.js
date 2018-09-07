const {model} = require("../../model")
const rebounds = require("../validation/rebounds")

exports.deliverStory = async (context) => {
  const res = await model.updateState(context, 'delivered')
  if(res.res.statusCode === 200)
    return rebounds("deliveredStory", context)
  return rebounds("failedDeliveredStory", context)
}
