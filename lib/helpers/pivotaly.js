const {common} = require("../commands/common")
const {isStoryIDValid} = require("../validation/validators/isStoryIDValid")
const {rebounds} = require("../validation/rebounds")

exports.getStoryID = (branch) => {
  const splitBranch = branch.split('-')
  const postStoryID = splitBranch.pop()
  const preStoryID = splitBranch[0]

  if(isStoryIDValid(context, postStoryID))
    return postStoryID
  else if(isStoryIDValid(context, preStoryID))
    return preStoryID
  return undefined
}

exports.getState = (context) => {
  const defaultState = JSON.stringify({branch: "", storyID: ""})
  return JSON.parse(context.workspaceState.get(common.globals.state, defaultState))
}

exports.setState = async (context, branch, story, rebound = false) => {
  const state = {branch, story}
  const update = await context.workspaceState.update(common.globals.state, JSON.stringify(state))
  rebounds("storyChange", context)
  return update
}
