const {pivotalTracker, setOptions} = require("../common")
const {common} = require("../../lib/commands/common")
const {normaliseFields} = require("../../lib/adapters/normaliseFields")


exports.getProject = function(context, fields = []) {
  fields = normaliseFields(fields)
  const endpoint = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}?fields=${fields.join()}`
  const options = setOptions(context, endpoint)

  return new Promise((resolve) => {
    pivotalTracker.get(options, (err, req, res, data) => resolve({res,data}))
  })
}
