const {common} = require("../commands/common")
const PtStory = require('../../model/stories')
const PtProject = require('../../model/projects')
 
const defaultState = {
  branch: "",
  story: "",
  isChore: false,
  storyDetails: {},
  projectDetails: {}
}

const getState = (context) => {
  return JSON.parse(context.workspaceState.get(common.globals.state, JSON.stringify(defaultState)))
}

const setState = async (context, branch, story) => {
  let state = getState(context)

  branch = branch || state.branch
  story = story || state.story

  // State was previously wiped
  if(!branch && !story) return
  
  state = {...state, branch, story}

  const storyResource = new PtStory(context, story)
  let storyDetails, isChore

  try {
    const story = await storyResource.getStory()
    storyDetails = story.data
    isChore = story.data.story_type === 'chore'
  } catch(e) {
    // set default isChore and storyDetails
    storyDetails = {}
    isChore = false
  }

  state = {...state, storyDetails, isChore}

  return updateState(context, state)
}

const wipeState = context => updateState(context, defaultState)

const refreshState = async context => {
  const state = getState(context)

  const projectResource = new PtProject(context)
  let projectDetails
  try {
    projectDetails = await projectResource.getProject()
    state.projectDetails = projectDetails.data
  } catch (err) {
    state.projectDetails = {}
  }

  updateState(context, state)

  return setState(context)
}

const updateState = (context, newState) =>
  context.workspaceState.update(common.globals.state, JSON.stringify(newState))

module.exports = {
  getState,
  setState,
  wipeState,
  refreshState
}
