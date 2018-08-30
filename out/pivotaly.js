const {workspace, commands, window, ViewColumn} = require("vscode")
const {createPTStatusBarItem} = require("../lib/pivotaly/createPTStatusBarItem")
const commandRepo = require("../lib/commands")
const {validate, validateStory} = require("../lib/validation/validate")
const path = require("path")
const gitEmit = require("git-emit")
const isRepo = require("../lib/validation/validators/isRepo")
const {setState} = require("../lib/helpers/pivotaly")
const {common} = require("../lib/commands/common")

async function activate(context) {
  const rootPath = workspace.workspaceFolders && workspace.workspaceFolders[0].uri.fsPath
  const isARepo = rootPath ? await isRepo(rootPath) : false
  context.workspaceState.update(common.globals.isARepo, isARepo)

  context.subscriptions.push(
    createPTStatusBarItem(),
    commands.registerCommand(commandRepo.commands.storyState.startStory, () => commandRepo.startStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.stopStory, () => commandRepo.stopStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.finishStory, () => commandRepo.finishStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.deliverStory, () => commandRepo.deliverStory(context)),
    commands.registerCommand(commandRepo.commands.workState.linkStory, () => commandRepo.linkStory(context)),
    commands.registerCommand(commandRepo.commands.internal.showCommandsQuickPick, () => commandRepo.showAllCommands(context)),
    commands.registerCommand(commandRepo.commands.internal.registerToken, () => commandRepo.registerToken(context)),
    commands.registerCommand(commandRepo.commands.internal.registerProjectID, () => commandRepo.registerProjectID(context)),
    commands.registerCommand(commandRepo.commands.statistics.cycleTime, () =>  commandRepo.showStats(context))
  )
  
  validate("token", context, true).then(() => {
    validate("projectID", context, true).then(() => {
      if (isARepo) validateStory(context)
      else validate("story", context)
    })
  })
  
  if(isARepo){
    const gitHook = gitEmit(path.join(rootPath, ".git"))
    gitHook.on("post-checkout", () => {
      validateStory(context)
    })
  }

  // run state migrations ;P
  setState(context)
}

function deactivate() {
  // clean up
}

module.exports = {
  activate,
  deactivate
}
