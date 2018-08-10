const {common} = require("../commands/common")
const {isStoryIDValid} = require("../validation/validators/isStoryIDValid")
const isStoryAChore = require("../validation/validators/isStoryAChore")
const {workspace} = require("vscode")

const getStoryID = async (context, branch) => {
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

const getState = (context) => {
  const defaultState = JSON.stringify({branch: "", story: ""})
  return JSON.parse(context.workspaceState.get(common.globals.state, defaultState))
}

const setState = async (context, branch = "", story = "") => {
  const state = getState(context)

  branch = branch || state.branch
  story = story || state.story

  const isChore = await isStoryAChore(context, story)

  const newState = {branch, story, isChore}
  return context.workspaceState.update(common.globals.state, JSON.stringify(newState))
}

module.exports = {
  getStoryID,
  getState,
  setState
}
