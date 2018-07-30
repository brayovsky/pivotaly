const {getActiveBranch} = require("../../helpers/git")

exports.didBranchChange = async (context) => {
  const defaultState = JSON.stringify({branch: "", storyID: ""})
  const pivotalyState = JSON.parse(context.workspaceState.get('pivotalyState', defaultState))
  const activeBranch = await getActiveBranch()
  return pivotalyState.branch != activeBranch
}
