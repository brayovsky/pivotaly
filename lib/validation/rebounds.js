const vscode = require("vscode")
const {commandRepo} = require("../commands")

exports.rebounds = function(elementValidated, ctx) {
  switch(elementValidated){
    case 'token':
      vscode.commands.executeCommand(commandRepo.commands.internal.registerToken, ctx)
    case 'projectID':
      vscode.commands.executeCommand(commandRepo.commands.internal.registerProjectID, ctx)
  }
}
