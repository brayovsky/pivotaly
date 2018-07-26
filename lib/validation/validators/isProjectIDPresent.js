const {common} = require("../../commands/common")

exports.isProjectIDPresent = function(context) {
  return !! context.workspaceState.get(common.globals.projectID)
}
