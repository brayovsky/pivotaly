const {pivotalTracker} = require("../common")
const {common} = require("../../lib/commands/common")
const {normaliseFields} = require("../../lib/adapters/normaliseFields")


exports.getProject = function(context, fields = []) {
  fields = normaliseFields(fields)
  const options = {
    path: `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}?fields=${fields.join()}`,
    headers: {
      "X-TrackerToken": `${context.globalState.get(common.globals.APItoken)}`
    }
  }

  return new Promise(function (resolve, reject) {
    pivotalTracker.get(options, function (err, req, res, data){
      if(err)
        reject({res,err})
      else
        resolve({res,data})
    })
  })
}
