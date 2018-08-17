const {common} = require("../commands/common")
const isStoryAChore = require("../validation/validators/isStoryAChore")
  
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
  getState,
  setState
}
