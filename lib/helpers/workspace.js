const {window, commands} = require('vscode')
const commandStrings = require('../commands/commands')
const reinstateWorkspace = require('../commands/reinstateWorkspace')
const ControlPanelDataProvider = require('../views/controlPanel/cpDataProvider')
const views = require('../views/views')
const {common} = require('../commands/common')

const setUpNotPtProjectEnvironment = async (context, wasAPtWorkspace) => {
  if(wasAPtWorkspace) {
    await context.workspaceState.update(common.globals.notPTProject, true)
    window.showInformationMessage('Workspace marked as not a pivotal tracker project. Pivotaly commands will not be available.')
  }
  if(context.subscriptions.length) context.subscriptions.forEach(el => el.dispose())

  const cpProvider = new ControlPanelDataProvider(context, null, null, false)
  context.subscriptions.push(
    window.registerTreeDataProvider(views.controlPanel, cpProvider),
    commands.registerCommand(commandStrings.commands.internal.reinstateWorkspace, () => reinstateWorkspace(context))
  )
}

module.exports = {
  setUpNotPtProjectEnvironment
}
