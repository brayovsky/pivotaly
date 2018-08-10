const {common} = require("../../commands/common")

exports.isProjectIDPresent = context => !!context.workspaceState.get(common.globals.projectID)
