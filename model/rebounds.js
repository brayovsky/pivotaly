const {commands, window} = require('vscode')
const commandRepo = require('../lib/commands/commands')

const messages = {
  ENOTFOUND: 'Ensure you have an active internet connection to utilise all Pivotaly features',
  invalid_authentication: 'Invalid token detected',
  invalid_parameter: 'The story seems to be incompletely formed',
  estimate: 'You need to estimate your story first'
}

module.exports = async (err, msg = '') => {
  const errCode = err.restCode || err.code
  msg = msg || messages[errCode]
  let redoAction = false

  switch(errCode){
    case 'ENOTFOUND':
      window.showWarningMessage(msg)
      break
    case 'invalid_authentication':
      window.showErrorMessage(msg) 
      commands.executeCommand(commandRepo.commands.internal.registerToken)
      break
    case 'invalid_parameter':
      window.showErrorMessage(err.body.general_problem)
  }
  
  return redoAction
}
