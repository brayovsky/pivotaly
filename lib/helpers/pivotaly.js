const {common} = require("../commands/common")
const {model, PtStory} = require('../../model')
  
const getState = (context) => {
  const defaultState = JSON.stringify({branch: "", story: ""})
  return JSON.parse(context.workspaceState.get(common.globals.state, defaultState))
}

const setState = async (context, branch, story) => {
  // linkStory verifies story ID
  const state = getState(context)

  branch = branch || state.branch
  story = story || state.story

  // State was previously wiped
  if(!branch && !story) return
  
  const storyDetails = (await model.getStory(context, story)).data
  const isChore = storyDetails.story_type === 'chore'

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

const refreshState = async context => {
  await setState(context)
}

module.exports = {
  getState,
  setState,
  wipeState,
  refreshState
}
