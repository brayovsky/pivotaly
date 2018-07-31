const {common} = require("../commands/common")
const {isStoryIDValid} = require("../validation/validators/isStoryIDValid")
const {workspace} = require("vscode")


exports.getStoryID = async (context, branch) => {
  const delimiter = workspace.getConfiguration().get('pivotaly.branchDelimiter')
  const splitBranch = branch.split(delimiter)
  const postStoryID = splitBranch.pop()
  const preStoryID = splitBranch[0]

  const isPostStoryValid = await isStoryIDValid(context, postStoryID)
  if(isPostStoryValid)
    return postStoryID
  
  const isPreStoryValid = await isStoryIDValid(context, preStoryID)
  if(isPreStoryValid)
    return preStoryID
  return undefined
}

exports.getState = (context) => {
  const defaultState = JSON.stringify({branch: "", story: ""})
  return JSON.parse(context.workspaceState.get(common.globals.state, defaultState))
}

exports.setState = async (context, branch, story) => {
  const state = {branch, story}
  return context.workspaceState.update(common.globals.state, JSON.stringify(state))
}
