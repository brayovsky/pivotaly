const {commands, window} = require("vscode")
const commandRepo = require("../commands/commands")
const {getState, wipeState, refreshState} = require("../helpers/state")
const requestToken = require('../procedures/requestToken')
const requestProjectId = require('../procedures/requestProjectId')

module.exports = async (elementValidated, ctx, msg = '', commandArgs = []) => {
  const args = commandArgs.length ? commandArgs : [ctx]
  const story = getState(ctx).story || ''
  switch(elementValidated){
    case 'token':
      requestToken(msg || 'Invalid token detected.', args)
      break
    case 'projectID':
      requestProjectId(msg || 'Invalid project id detected.', args)
      break
    case 'defaultBranch':
      wipeState(ctx)
      window.showInformationMessage(msg || 'Switch to a feature branch to start working on a story')
      commands.executeCommand(commandRepo.commands.storyState.refreshStateView, args)      
      break
    case 'story':
      window.showWarningMessage(msg || 'Invalid story ID.')
      await commands.executeCommand(commandRepo.commands.workState.linkStory, [ctx])
      commands.executeCommand(commandRepo.commands.storyState.refreshStateView, args)
      break
    case 'storyChange':
      window.showInformationMessage(msg || `Changed story to ${story}`)
      commands.executeCommand(commandRepo.commands.storyState.refreshStateView, args)
      break
    case 'invalidBranchName':
      window.showWarningMessage(msg || 'Could not detect a story id from branch name. You may need to link a story manually.')
      commands.executeCommand(commandRepo.commands.workState.linkStory, args)
      break
    case 'sameStory':
      window.showInformationMessage(msg || `Working on story ${story}`)
      break
    case 'startedStory':
      window.showInformationMessage(msg || `Successfully started story ${story}`)
      break
    case 'failedStartStory':
      window.showErrorMessage(msg || `Could not successfully start story ${story}`)
      break
    case 'unstartedStory':
      window.showInformationMessage(msg || `Successfully unstarted story ${story}`)
      break
    case 'failedUnstartStory':
      window.showErrorMessage(msg || `Could not successfully stop story ${story}`)
      break
    case 'finishedStory':
      window.showInformationMessage(msg || `Finished story ${story} successfully`)
      break
    case 'failedFinishedStory':
      window.showErrorMessage(msg || `Could not successfully finish story ${story}`)
      break
    case 'deliveredStory':
      window.showInformationMessage(msg || `Delivered story ${story} successfully`)
      break
    case 'failedDeliveredStory':
      window.showErrorMessage(msg || `Could not successfully deliver story ${story}`)
      break
    case 'linkedStory':
      window.showInformationMessage(msg || `Successfully linked story ${story}`)
      commands.executeCommand(commandRepo.commands.storyState.refreshStateView, args)
      break
    case 'failedLinkedStory':
      window.showErrorMessage(msg || `Could not link story. You are using a protected branch`)
      break
    case 'deliveredTask':
      window.showInformationMessage(msg || 'Successfully delivered task')
      await refreshState(ctx)
      break
    case 'failedDeliveredTask':
      window.showErrorMessage(msg || 'Failed to deliver task')
      break
    case 'undeliveredTask':
      window.showInformationMessage(msg || 'Successfully undelivered task')
      await refreshState(ctx)
      break
    case 'failedUndeliveredTask':
      window.showErrorMessage(msg || 'Failed to undeliver task')
      break
    case 'resolvedBlocker':
      window.showInformationMessage('Successfully resolved blocker')
      await refreshState(ctx)
      break
    case 'failedResolveBlocker':
      window.showErrorMessage(msg || 'Failed to resolve blocker')
      break
    case 'unresolvedBlocker':
      window.showInformationMessage(msg || 'Successfully unresolved blocker')
      await refreshState(ctx)
      break
    case 'failedUnresolveBlocker':
      window.showErrorMessage(msg || 'Failed to unresolve blocker')
    case 'failedAddBlocker':
      window.showErrorMessage(msg || 'Could not add blocker')
    case 'addBlocker':
      await refreshState(ctx)
      window.showInformationMessage(msg || 'Added blocker successfully')
    case 'failedAddTask':
      window.showErrorMessage(msg || 'Could not add task')
    case 'addTask':
      await refreshState(ctx)
      window.showInformationMessage(msg || 'Added task successfully')
  }
}
