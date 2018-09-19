const {pivotalTracker, setOptions} = require('../common')
const {common} = require("../../lib/commands/common")

const getBlockers = (context, storyID) => {
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}/blockers`
  const options = setOptions(context, endpoint)

  return new Promise(resolve =>
    pivotalTracker.get(options, (err, req, res, data) => resolve({res, data}))
  )
}

const updateBlocker = (context, storyId, blockerId, updateData) => {
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyId}/blockers/${blockerId}`
  const options = setOptions(context, endpoint)

  return new Promise(resolve =>
    pivotalTracker.put(options, updateData, (err, req, res, data) => resolve({res, data}))
  )
}

const resolveBlocker = (context, storyID, taskId) =>
  updateBlocker(context, storyID, taskId, {resolved: true})

const unresolveBlocker  = (context, storyID, taskId) =>
  updateBlocker(context, storyID, taskId, {resolved: false})

module.exports = {
  getBlockers,
  resolveBlocker,
  unresolveBlocker
}
