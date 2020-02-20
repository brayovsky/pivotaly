const {workspace} = require("vscode")
const {getActiveBranch} = require("../../helpers/git")

exports.isBranchDefault = async (context, currentBranch = '') => {
  const branch = currentBranch || await getActiveBranch()
  const protectedBranches = workspace.getConfiguration().get('pivotaly.protectedBranches')
  return !protectedBranches.includes(branch)
}
