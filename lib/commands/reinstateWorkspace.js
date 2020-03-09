const {common} = require('./common')
const {commands} = require('vscode')

module.exports = context => {
  context.workspaceState.update(common.globals.notPTProject, false)
  commands.executeCommand('workbench.action.reloadWindow')
}
