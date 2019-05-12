const {getActiveBranch} = require("../../helpers/git")
const {getState} = require("../../helpers/state")

exports.didBranchChange = async (context) => {
  const pivotalyState = getState(context)
  const activeBranch = await getActiveBranch()
  return pivotalyState.branch != activeBranch
}
