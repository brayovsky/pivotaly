const {model} = require("../../model")
const rebounds = require("../validation/rebounds")
const {getState} = require("../helpers/pivotaly")

exports.finishStory = async (context) => {
  const chore = getState(context)
  const newState = chore.isChore ? 'accepted' : 'finished'
  const res = await model.updateState(context, newState)
  if(res.res.statusCode === 200)
    return rebounds("finishedStory", context)
  return rebounds("failedFinishedStory", context)
}
