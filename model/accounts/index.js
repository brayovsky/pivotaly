const {pivotalTracker, setOptions} = require('../common')
const {common} = require("../../lib/commands/common")

const getMemberships = context => {
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/memberships`
  const options = setOptions(context, endpoint)

  return new Promise(resolve =>
    pivotalTracker.get(options, (err, req, res, data) => resolve({res, data}))
  )
}

module.exports = {
  getMemberships
}
