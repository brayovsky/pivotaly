const {common} = require("../../commands/common")

exports.isTokenPresent = function(context) {
  return !! context.workspaceState.get(common.globals.APItoken)
}
