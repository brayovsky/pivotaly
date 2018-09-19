const {pivotalTracker, setOptions} = require('../common')
const {common} = require('../../lib/commands/common')

const getAllTasks = (context, storyID) => {
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}/tasks`
  const options = setOptions(context, endpoint)

  return new Promise(resolve =>
    pivotalTracker.get(options, (err, req, res, data) => resolve({res, data}))
  )
}

const updateTask = (context, storyID, taskId, updateData) => {
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}/tasks/${taskId}`
  const options = setOptions(context, endpoint)

  return new Promise(resolve =>
    pivotalTracker.put(options, updateData, (err, req, res, data) => resolve({res, data}))
  )
}

const deliverTask = (context, storyID, taskId) =>
  updateTask(context, storyID, taskId, {complete: true})

const undeliverTask  = (context, storyID, taskId) =>
  updateTask(context, storyID, taskId, {complete: false})

module.exports = {
  getAllTasks,
  deliverTask,
  undeliverTask
}
