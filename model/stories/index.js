const {pivotalTracker} = require("../common")
const {common} = require("../../lib/commands/common")

exports.getStory = function(context, storyID, callback, fields = []) {
  if(! Array.isArray(fields)) fields = String(fields).split(",")
  const options = {
    path: `/services/v5/projects/${context.globalState.get(common.globals.projectID)}/stories/${storyID}?fields=${fields.join()}`,
    headers: {
      "X-TrackerToken": `${context.globalState.get(common.globals.APItoken)}`
    }
  }
  pivotalTracker.get(options, callback)
}
