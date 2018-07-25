const {pivotalTracker} = require("../common")
const {common} = require("../../lib/commands/common")

exports.getStory = function(context, storyID, fields = []) {
  if(! Array.isArray(fields)) fields = String(fields).split(",")
  const options = {
    path: `/services/v5/projects/${context.workspaceState.get(common.globals.projectID)}/stories/${storyID}?fields=${fields.join()}`,
    headers: {
      "X-TrackerToken": `${context.globalState.get(common.globals.APItoken)}`
    }
  }

  return new Promise(function (resolve, reject) {
    pivotalTracker.get(options, function (err, req, res, data){
      if(err)
        reject({
          res,
          err
        })
      else
        resolve({
          res,
          data
        })
    })
  })
}
