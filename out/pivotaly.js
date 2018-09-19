const {workspace, commands, window} = require("vscode")
const path = require("path")
const gitEmit = require("git-emit")
const {createPTStatusBarItem} = require("../lib/pivotaly/createPTStatusBarItem")
const {validate, validateStory} = require("../lib/validation/validate")
const commandRepo = require("../lib/commands")
const isRepo = require("../lib/validation/validators/isRepo")
const {refreshState} = require("../lib/helpers/pivotaly")
const {common} = require("../lib/commands/common")
const CycleTimeDataProvider = require('../lib/views/cycleTimeDataProvider')
const StoryInfoDataProvider = require('../lib/views/storyInfoDataProvider')


const activate = async context => {
  await refreshState(context)

  const rootPath = (workspace.workspaceFolders && workspace.workspaceFolders[0].uri.fsPath) || workspace.rootPath
  const isARepo = rootPath ? await isRepo(rootPath) : false
  context.workspaceState.update(common.globals.isARepo, isARepo)

  const cycleTimeProvider = new CycleTimeDataProvider(context)
  const storyInfoProvider = new StoryInfoDataProvider(context)

  // TODO: mask view ids
  context.subscriptions.push(
    createPTStatusBarItem(),
    window.registerTreeDataProvider('pivotaly.view.membercycle', cycleTimeProvider),
    window.registerTreeDataProvider('pivotaly.view.storyinfo', storyInfoProvider),
    commands.registerCommand(commandRepo.commands.storyState.startStory, () => commandRepo.startStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.stopStory, () => commandRepo.stopStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.finishStory, () => commandRepo.finishStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.deliverStory, () => commandRepo.deliverStory(context)),
    commands.registerCommand(commandRepo.commands.workState.linkStory, () => commandRepo.linkStory(context)),
    commands.registerCommand(commandRepo.commands.internal.showCommandsQuickPick, () => commandRepo.showAllCommands(context)),
    commands.registerCommand(commandRepo.commands.internal.registerToken, () => commandRepo.registerToken(context)),
    commands.registerCommand(commandRepo.commands.internal.registerProjectID, () => commandRepo.registerProjectID(context)),
    commands.registerCommand(commandRepo.commands.statistics.cycleTime, (context, scope, iteration_number) =>  commandRepo.showStats(context, scope, iteration_number)),
    commands.registerCommand(commandRepo.commands.storyState.refreshStateView, () => commandRepo.refreshStateView(context, storyInfoProvider)),
    commands.registerCommand(commandRepo.commands.storyState.deliverTask, taskTreeeItem => commandRepo.deliverTask(taskTreeeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.unDeliverTask, taskTreeItem => commandRepo.undeliverTask(taskTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.resolveBlocker, blockerTreeItem => commandRepo.resolveBlocker(blockerTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.unResolveBlocker, blockerTreeItem => commandRepo.unresolveBlocker(blockerTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.showStoryDescription, description => commandRepo.viewStoryDescription(description))
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
}

const deactivate = () => {
  // clean up
}

module.exports = {
  activate,
  deactivate
}
