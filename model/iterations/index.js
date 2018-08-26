const {pivotalTracker, setOptions} = require('../common')
const {common} = require("../../lib/commands/common")

const getIterationCycleTime = (context, iterationNumber = 0) => {
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/iterations/${iterationNumber}/analytics/cycle_time_details`
  const options = setOptions(context, endpoint)

  return new Promise(resolve =>
    pivotalTracker.get(options, (err, req, res, data) => resolve({res, data}))
  )
}

module.exports = {
  getIterationCycleTime
}
