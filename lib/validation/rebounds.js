const vscode = require("vscode")
const {commandRepo} = require("../commands")

exports.rebounds = function(elementValidated) {
  switch(elementValidated){
    case 'token':
      vscode.commands.executeCommand(commandRepo.commands.internal.registerToken)
  }
}
