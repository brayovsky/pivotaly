const {commands, window} = require("vscode")
const {commandRepo} = require("../commands")
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
      return window.showErrorMessage('Could not detect a story id from branch name. You may need to link a story manually.')
      // return link story
    case 'sameStory':
      return window.showInformationMessage(`Working on story ${story}`)
    case 'startedStory':
      return window.showInformationMessage(`Successfully started story ${story}`)
    case 'failedStartStory':
      return window.showInformationMessage(`Could not successfully start story ${story}`)
  }
}
