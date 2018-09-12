const {pivotalTracker, setOptions} = require("../common")
const {common} = require("../../lib/commands/common")
const {normaliseFields} = require("../../lib/adapters/normaliseFields")
const {getState} = require("../../lib/helpers/pivotaly")

const getStory = (context, storyID, fields = []) => {
  fields = normaliseFields(fields).join()

  let endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}?`

  if(fields) endpoint += `fields=${fields}`
  const options = setOptions(context, endpoint)

  return new Promise((resolve) => {
    pivotalTracker.get(options, (err, req, res, data) => resolve({res,data})) 
  })
}

const changeStoryState = (context, storyID, newState) => {
  let update = { current_state: newState }
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}`
  const options = setOptions(context, endpoint)

  return new Promise((resolve) => {
    pivotalTracker.put(options, update, (err, req, res, data) => resolve({res, data}))
  })
}
const updateState = (context, newState, storyID = null) => {
  return storyID ? changeStoryState(context, storyID, newState) :
    changeStoryState(context, getState(context).story, newState)
}

module.exports = {
  getStory,
  updateState
}
