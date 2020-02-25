const {workspace, commands, window} = require('vscode')
const {createPTStatusBarItem} = require('../lib/pivotaly/createPTStatusBarItem')
const {validate, validateStory} = require('../lib/validation/validate')
const commandRepo = require('../lib/commands')
const isRepo = require('../lib/validation/validators/isRepo')
const {refreshState} = require('../lib/helpers/state')
const {common} = require('../lib/commands/common')
const ControlPanelDataProvider = require('../lib/views/controlPanel/cpDataProvider')
const CycleTimeDataProvider = require('../lib/views/memberCycletime/cycleTimeDataProvider')
const StoryInfoDataProvider = require('../lib/views/storyInfo/storyInfoDataProvider')
const CurrentAndBacklogDataProvider = require('../lib/views/currentandBacklog/currentandBacklogDataProvider')
const views = require('../lib/views/views')
const unlinkGitEmit = require('../lib/fixes/unlinkGitEmit')
const {listenForCheckOut} = require('../lib/helpers/git')


const setUpNotPtProjectEnvironment = async context => {
  const cpProvider = new ControlPanelDataProvider(context, null, null, false)
  context.subscriptions.push(
    window.registerTreeDataProvider(views.controlPanel, cpProvider),
    commands.registerCommand(commandRepo.commands.internal.reinstateWorkspace, () => commandRepo.reinstateWorkspace(context))
  )
}

const activate = async context => {
  if(workspace.workspaceFolders === undefined) return

  await refreshState(context)
  const rootPath = (workspace.workspaceFolders && workspace.workspaceFolders[0].uri.fsPath) || workspace.rootPath
  const isARepo = rootPath ? await isRepo(rootPath) : false
  context.workspaceState.update(common.globals.isARepo, isARepo)

  if(context.workspaceState.get(common.globals.notPTProject)) return setUpNotPtProjectEnvironment(context);

  const statusBarItem = createPTStatusBarItem()

  const cycleTimeProvider = new CycleTimeDataProvider(context, 6, 'done_current')
  const storyInfoProvider = new StoryInfoDataProvider(context)
  const cpProvider = new ControlPanelDataProvider(context, storyInfoProvider, cycleTimeProvider)
  const currentBacklogProvider = new CurrentAndBacklogDataProvider(context)

  context.subscriptions.push(
    statusBarItem,
    window.registerTreeDataProvider(views.memberCycle, cycleTimeProvider),
    window.registerTreeDataProvider(views.storyInfo, storyInfoProvider),
    window.registerTreeDataProvider(views.controlPanel, cpProvider),
    window.registerTreeDataProvider(views.currentAndBacklog, currentBacklogProvider),
    commands.registerCommand(commandRepo.commands.storyState.startStory, backlogTreeItem => commandRepo.startStory(context, storyInfoProvider, backlogTreeItem)),
    commands.registerCommand(commandRepo.commands.storyState.stopStory, () => commandRepo.stopStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.finishStory, () => commandRepo.finishStory(context)),
    commands.registerCommand(commandRepo.commands.storyState.deliverStory, () => commandRepo.deliverStory(context)),
    commands.registerCommand(commandRepo.commands.workState.linkStory, () => commandRepo.linkStory(context, storyInfoProvider)),
    commands.registerCommand(commandRepo.commands.internal.showCommandsQuickPick, () => commandRepo.showAllCommands(context, storyInfoProvider)),
    commands.registerCommand(commandRepo.commands.internal.registerToken, () => commandRepo.registerToken(context, storyInfoProvider)),
    commands.registerCommand(commandRepo.commands.internal.registerProjectID, () => commandRepo.registerProjectID(context, storyInfoProvider)),
    commands.registerCommand(commandRepo.commands.statistics.cycleTime, (context, iteration) =>  commandRepo.showStats(context, iteration)),
    commands.registerCommand(commandRepo.commands.storyState.refreshStateView, () => commandRepo.refreshStateView(context, storyInfoProvider)),
    commands.registerCommand(commandRepo.commands.storyState.refreshMemberCycleView, () => commandRepo.refreshDataProvider(cycleTimeProvider)),
    commands.registerCommand(commandRepo.commands.storyState.refreshBacklog, () => commandRepo.refreshDataProvider(currentBacklogProvider)),
    commands.registerCommand(commandRepo.commands.storyState.addTask, taskTreeItem => commandRepo.addTask(taskTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.deliverTask, taskTreeeItem => commandRepo.deliverTask(taskTreeeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.unDeliverTask, taskTreeItem => commandRepo.undeliverTask(taskTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.addBlocker, blockerTreeItem => commandRepo.addBlocker(blockerTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.resolveBlocker, blockerTreeItem => commandRepo.resolveBlocker(blockerTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.unResolveBlocker, blockerTreeItem => commandRepo.unresolveBlocker(blockerTreeItem, context)),
    commands.registerCommand(commandRepo.commands.storyState.showStoryDescription, description => commandRepo.viewStoryDescription(description)),
    commands.registerCommand(commandRepo.commands.internal.copyToClipboard, text => commandRepo.copy(text, context))
  )

  validate('token', context).then(_didValidationSucceed => {
    validate('projectID', context, true).then(_didProjectValidationSucceed => {
      if (isARepo) validateStory(context, storyInfoProvider)
      else validate('story', context, true).then(didSucceed => {}, didFail => {})
    }, _didProjectValidationSucceed => {})
  }, _didValidationSucceed => {})

  if(isARepo){
    unlinkGitEmit(context, rootPath)
    listenForCheckOut(context, validateStory, context, storyInfoProvider)
  }
}

const deactivate = () => {
  // clean up
}

module.exports = {
  activate,
  deactivate
}
