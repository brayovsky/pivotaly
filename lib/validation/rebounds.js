const {commands, window} = require("vscode")
const {commandRepo} = require("../commands")
const {getState} = require("../helpers/pivotaly")

let story

exports.rebounds = (elementValidated, ctx) => {
  switch(elementValidated){
    case 'token':
      return commands.executeCommand(commandRepo.commands.internal.registerToken, ctx)
    case 'projectID':
      return commands.executeCommand(commandRepo.commands.internal.registerProjectID, ctx)
    case 'defaultBranch':
      return window.showInformationMessage('Switch to a feature branch to start working on a story')
    case 'storyChange':
      story = getState(ctx).story
      return window.showInformationMessage(`Changed story to ${story}`)
    case 'invalidBranchName':
      return window.showErrorMessage('Could not detect a story id from branch name. You may need to link a story manually.')
      // return link story
    case 'sameStory':
      story = getState(ctx).story
      return window.showInformationMessage(`Working on story ${story}`)
  }
}
