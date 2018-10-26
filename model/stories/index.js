const {pivotalTracker, setOptions} = require("../common")
const {common} = require("../../lib/commands/common")
const {normaliseFields} = require("../../lib/adapters/normaliseFields")

const changeStoryState = (context, storyID, newState) => {
  let update = { current_state: newState }
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}`
  const options = setOptions(context, endpoint)

  return new Promise((resolve) => {
    pivotalTracker.put(options, update, (err, req, res, data) => resolve({res, data}))
  })
}

// TODO: update function to require storyid
const updateState = (context, newState, storyID = null) => {
  // using getState might cause cyclic dependency complications
  const currentStory = context.workspaceState.get(common.globals.state, {branch: "", story: ""}).story
  return storyID ? changeStoryState(context, storyID, newState) :
    changeStoryState(context, currentStory, newState)
}

module.exports = {
  updateState,
}
