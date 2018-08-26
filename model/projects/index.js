const {pivotalTracker, options, setTokenHeader} = require("../common")
const {common} = require("../../lib/commands/common")
const {normaliseFields} = require("../../lib/adapters/normaliseFields")


exports.getProject = function(context, fields = []) {
  fields = normaliseFields(fields)
  options.path = `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}?fields=${fields.join()}`
  setTokenHeader(context, options)

  return new Promise((resolve) => {
    // @ts-ignore
    pivotalTracker.get(options, (err, req, res, data) => resolve({res,data}))
  })
}
