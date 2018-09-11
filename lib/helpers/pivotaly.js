const {common} = require("../commands/common")
const isStoryAChore = require("../validation/validators/isStoryAChore")
const {model} = require('../../model')
  
const getState = (context) => {
  const defaultState = JSON.stringify({branch: "", story: ""})
  return JSON.parse(context.workspaceState.get(common.globals.state, defaultState))
}

const setState = async (context, branch = "", story = "") => {
  // linkStory verifies story ID
  const state = getState(context)

  branch = branch || state.branch
  story = story || state.story

  const storyRes = await model.getStory(context, story)
  const storyDetails = storyRes.data

  const isChore = await isStoryAChore(context, story)

  const newState = {branch, story, isChore, storyDetails}
  return context.workspaceState.update(common.globals.state, JSON.stringify(newState))
}

const wipeState = context => {
  const newState = {
    branch: undefined,
    story: undefined,
    isChore: undefined,
    storyDetails: undefined,
  }
  return context.workspaceState.update(common.globals.state, JSON.stringify(newState))
}

module.exports = {
  getState,
  setState,
  wipeState
}
