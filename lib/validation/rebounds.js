const {commands, window} = require("vscode")
const commandRepo = require("../commands/commands")
const {getState} = require("../helpers/pivotaly")

exports.rebounds = (elementValidated, ctx) => {
  const story = getState(ctx).story
  switch(elementValidated){
    case 'token':
      return commands.executeCommand(commandRepo.commands.internal.registerToken, ctx)
    case 'projectID':
      return commands.executeCommand(commandRepo.commands.internal.registerProjectID, ctx)
    case 'defaultBranch':
      return window.showInformationMessage('Switch to a feature branch to start working on a story')
    case 'storyChange':
      return window.showInformationMessage(`Changed story to ${story}`)
    case 'invalidBranchName':
      window.showErrorMessage('Could not detect a story id from branch name. You may need to link a story manually.')
      return commands.executeCommand(commandRepo.commands.workState.linkStory)
    case 'sameStory':
      return window.showInformationMessage(`Working on story ${story}`)
    case 'startedStory':
      return window.showInformationMessage(`Successfully started story ${story}`)
    case 'failedStartStory':
      return window.showErrorMessage(`Could not successfully start story ${story}`)
    case 'unstartedStory':
      return window.showInformationMessage(`Successfully unstarted story ${story}`)
    case 'failedUnstartStory':
      return window.showErrorMessage(`Could not successfully stop story ${story}`)
    case 'finishedStory':
      return window.showInformationMessage(`Finished story ${story} successfully`)
    case 'failedFinishedStory':
      return window.showErrorMessage(`Could not successfully finish story ${story}`)
    case 'deliveredStory':
      return window.showInformationMessage(`Delivered story ${story} successfully`)
    case 'failedDeliveredStory':
      return window.showErrorMessage(`Could not successfully deliver story ${story}`)
    case 'linkedStory':
      return window.showInformationMessage(`Successfully linked story ${story}`)
    case 'failedLinkedStory':
    return window.showErrorMessage(`Could not link story. You either input an invalid story ID or are using a protected branch`)
  }
}
