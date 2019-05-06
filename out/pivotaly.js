const {workspace, commands, window} = require('vscode')
const {createPTStatusBarItem} = require('../lib/pivotaly/createPTStatusBarItem')
const {validate, validateStory} = require('../lib/validation/validate')
const commandRepo = require('../lib/commands')
const isRepo = require('../lib/validation/validators/isRepo')
const {refreshState, getState} = require('../lib/helpers/pivotaly')
const {common} = require('../lib/commands/common')
const CycleTimeDataProvider = require('../lib/views/cycleTimeDataProvider')
const StoryInfoDataProvider = require('../lib/views/storyInfoDataProvider')
const ControlPanelDataProvider = require('../lib/views/controlPanel/cpDataProvider')
const views = require('../lib/views/views')
const unlinkGitEmit = require('../lib/fixes/unlinkGitEmit')
const {listenForCheckOut} = require('../lib/helpers/git')
const GitEvents = require('../lib/events/gitEvents')


const activate = async context => {
  await refreshState(context)
  const rootPath = (workspace.workspaceFolders && workspace.workspaceFolders[0].uri.fsPath) || workspace.rootPath
  const isARepo = rootPath ? await isRepo(rootPath) : false
  context.workspaceState.update(common.globals.isARepo, isARepo)

  if(context.workspaceState.get(common.globals.notPTProject) === true) return;

  const statusBarItem = createPTStatusBarItem()

  const cycleTimeProvider = new CycleTimeDataProvider(context)
  const storyInfoProvider = new StoryInfoDataProvider(context)
  const cpProvider = new ControlPanelDataProvider(context, statusBarItem)

  context.subscriptions.push(
    statusBarItem,
    window.registerTreeDataProvider(views.memberCycle, cycleTimeProvider),
    window.registerTreeDataProvider(views.storyInfo, storyInfoProvider),
    window.registerTreeDataProvider(views.controlPanel, cpProvider),
    commands.registerCommand(commandRepo.commands.storyState.startStory, () => commandRepo.startStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.stopStory, () => commandRepo.stopStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.finishStory, () => commandRepo.finishStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.deliverStory, () => commandRepo.deliverStory(context)),
    commands.registerCommand(commandRepo.commands.workState.linkStory, () => commandRepo.linkStory(context)),
    commands.registerCommand(commandRepo.commands.internal.showCommandsQuickPick, () => commandRepo.showAllCommands(context)),
    commands.registerCommand(commandRepo.commands.internal.registerToken, () => commandRepo.registerToken(context)),
    commands.registerCommand(commandRepo.commands.internal.registerProjectID, () => commandRepo.registerProjectID(context, statusBarItem)),
    commands.registerCommand(commandRepo.commands.statistics.cycleTime, (context, scope, iteration_number) =>  commandRepo.showStats(context, scope, iteration_number)),
    commands.registerCommand(commandRepo.commands.storyState.refreshStateView, () => commandRepo.refreshStateView(context, storyInfoProvider)),
    commands.registerCommand(commandRepo.commands.storyState.deliverTask, taskTreeeItem => commandRepo.deliverTask(taskTreeeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.unDeliverTask, taskTreeItem => commandRepo.undeliverTask(taskTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.resolveBlocker, blockerTreeItem => commandRepo.resolveBlocker(blockerTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.unResolveBlocker, blockerTreeItem => commandRepo.unresolveBlocker(blockerTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.showStoryDescription, description => commandRepo.viewStoryDescription(description))
  )

  validate('token', context, true).then(_didValidationSucceed => {
    validate('projectID', context, true).then(_didProjectValidationSucceed => {
      if (isARepo) validateStory(context)
      else validate('story', context).then(didSucceed => {}, didFail => {})
    }, _didProjectValidationSucceed => window.showErrorMessage('Invalid project id detected.') )
  }, _didValidationSucceed => window.showErrorMessage('Invalid token detected.')
  )

  if(isARepo){
    unlinkGitEmit(context, rootPath)
    const gitEvents = new GitEvents()
    gitEvents.on('checkout', () => {
      validateStory(context)
    })
    listenForCheckOut(gitEvents)
  }
}

const deactivate = () => {
  // clean up
}

module.exports = {
  activate,
  deactivate
}
