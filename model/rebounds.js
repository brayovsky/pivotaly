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
      const hasEstimateError = err.body.validation_errors &&
        err.body.validation_errors.some(valError => valError.field === 'estimate')
      if(hasEstimateError) {
        window.showErrorMessage(messages.estimate)
        await commands.executeCommand(commandRepo.commands.storyState.estimateStory)
        redoAction = true
      } else {
        window.showErrorMessage(msg)
      }
      break
    default:
      window.showErrorMessage('An error occured')
  }
  
  return redoAction
}
