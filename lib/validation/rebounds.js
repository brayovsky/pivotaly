const {commands, window} = require("vscode")
const commandRepo = require("../commands")
const {getState} = require("../helpers/pivotaly")

module.exports = (elementValidated, ctx) => {
  const story = getState(ctx).story
  switch(elementValidated){
    case 'token':
      commands.executeCommand(commandRepo.commands.internal.registerToken, ctx)
      break
    case 'projectID':
      commands.executeCommand(commandRepo.commands.internal.registerProjectID, ctx)
      break
    case 'defaultBranch':
      window.showInformationMessage('Switch to a feature branch to start working on a story')
      break
    case 'story':
      window.showErrorMessage('Could not link story. You input an invalid story ID.')
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
      window.showErrorMessage(`Could not link story. You either input an invalid story ID or are using a protected branch`)
  }
}
