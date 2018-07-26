const {common} = require("../../commands/common")

exports.isProjectIDPresent = function(context) {
  console.log("checking in storage")
  return !! context.workspaceState.get(common.globals.projectID)
}
