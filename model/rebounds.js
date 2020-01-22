const {commands, window} = require('vscode')
const commandRepo = require('../lib/commands/commands')

const messages = {
  network: 'Ensure you have an active internet connection to utilise all Pivotaly features',
  token: 'Invalid token detected'
}

module.exports = async (elementValidated, ctx, msg = '', commandArgs = []) => {
  const args = commandArgs.length ? commandArgs : [ctx]
  msg = msg || messages[elementValidated]

  switch(elementValidated){
    case 'network':
      window.showWarningMessage(msg)
      break
    case 'token':
      window.showErrorMessage(msg) 
      commands.executeCommand(commandRepo.commands.internal.registerToken, args)
      break
  }
}
