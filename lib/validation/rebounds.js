const {commands, window} = require("vscode")
const commandRepo = require("../commands/commands")
const {getState, wipeState, refreshState} = require("../helpers/state")

module.exports = async (elementValidated, ctx) => {
  const story = getState(ctx).story || ''
  switch(elementValidated){
    case 'token':
      window.showErrorMessage('Invalid project id detected.') 
      commands.executeCommand(commandRepo.commands.internal.registerToken, ctx)
      break
    case 'projectID':
      window.showErrorMessage('Invalid token detected.')
      commands.executeCommand(commandRepo.commands.internal.registerProjectID, ctx)
      break
    case 'defaultBranch':
      wipeState(ctx)
      window.showInformationMessage('Switch to a feature branch to start working on a story')
      break
    case 'story':
      window.showErrorMessage('Invalid story ID.')
      commands.executeCommand(commandRepo.commands.workState.linkStory, ctx)
      break
    case 'storyChange':
      window.showInformationMessage(`Changed story to ${story}`)
      break
    case 'invalidBranchName':
      window.showErrorMessage('Could not detect a story id from branch name. You may need to link a story manually.')
      commands.executeCommand(commandRepo.commands.workState.linkStory)
      break
    case 'sameStory':
      window.showInformationMessage(`Working on story ${story}`)
      break
    case 'startedStory':
      window.showInformationMessage(`Successfully started story ${story}`)
      break
    case 'failedStartStory':
      window.showErrorMessage(`Could not successfully start story ${story}`)
      break
    case 'unstartedStory':
      window.showInformationMessage(`Successfully unstarted story ${story}`)
      break
    case 'failedUnstartStory':
      window.showErrorMessage(`Could not successfully stop story ${story}`)
      break
    case 'finishedStory':
      window.showInformationMessage(`Finished story ${story} successfully`)
      break
    case 'failedFinishedStory':
      window.showErrorMessage(`Could not successfully finish story ${story}`)
      break
    case 'deliveredStory':
      window.showInformationMessage(`Delivered story ${story} successfully`)
      break
    case 'failedDeliveredStory':
      window.showErrorMessage(`Could not successfully deliver story ${story}`)
      break
    case 'linkedStory':
      window.showInformationMessage(`Successfully linked story ${story}`)
      break
    case 'failedLinkedStory':
      window.showErrorMessage(`Could not link story. You are using a protected branch`)
      break
    case 'deliveredTask':
      window.showInformationMessage('Successfully delivered task')
      await refreshState(ctx)
      break
    case 'failedDeliveredTask':
      window.showErrorMessage('Failed to deliver task')
      break
    case 'undeliveredTask':
      window.showInformationMessage('Successfully undelivered task')
      await refreshState(ctx)
      break
    case 'failedUndeliveredTask':
      window.showErrorMessage('Failed to undeliver task')
      break
    case 'resolvedBlocker':
      window.showInformationMessage('Successfully resolved blocker')
      await refreshState(ctx)
      break
    case 'failedResolveBlocker':
      window.showErrorMessage('Failed to resolve blocker')
      break
    case 'unresolvedBlocker':
      window.showInformationMessage('Successfully unresolved blocker')
      await refreshState(ctx)
      break
    case 'failedUnresolveBlocker':
      window.showErrorMessage('Failed to unresolve blocker')
  }
}
