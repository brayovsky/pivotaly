const {pivotalTracker, setOptions} = require('../common')
const {common} = require("../../lib/commands/common")

const getBlockers = (context, storyID) => {
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}/blockers`
  const options = setOptions(context, endpoint)

  return new Promise(resolve =>
    pivotalTracker.get(options, (err, req, res, data) => resolve({res, data}))
  )
}

module.exports = {
  getBlockers
}
