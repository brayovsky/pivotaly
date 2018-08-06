const {workspace} = require("vscode")
const {getActiveBranch} = require("../../helpers/git")

exports.isBranchDefault = async () => {
  const branch = await getActiveBranch()
  const protectedBranches = workspace.getConfiguration().get('pivotaly.protectedBranches')
  return !protectedBranches.includes(branch)
}
