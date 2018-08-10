const {pivotalTracker, options} = require("../common")
const {common} = require("../../lib/commands/common")
const {normaliseFields} = require("../../lib/adapters/normaliseFields")
const {getState} = require("../../lib/helpers/pivotaly")

const getStory = (context, storyID, fields = []) => {
  fields = normaliseFields(fields)
  options.path = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}?fields=${fields.join()}`
  options.headers['X-TrackerToken'] = context.globalState.get(common.globals.APItoken)

  return new Promise((resolve) => {
    // @ts-ignore
    pivotalTracker.get(options, (err, req, res, data) => resolve({res,data})) 
  })
}

const changeStoryState = (context, storyID, newState) => {
  let update = { current_state: newState }
  options.path = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}`
  options.headers['X-TrackerToken'] = context.globalState.get(common.globals.APItoken)
  return new Promise((resolve) => {
    // @ts-ignore
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
