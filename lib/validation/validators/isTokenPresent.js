const {common} = require("../../commands/common")

exports.isTokenPresent = function(context) {
  return !! context.globalState.get(common.globals.APItoken)
}
