const {window} = require('vscode')
const {common} = require('../commands/common')
const {validate, validateStory} = require('../validation/validate')

const onRej = msg => window.showWarningMessage(msg)

const registerToken = context => {
  const prompt = 'Please provide a valid Pivotal Tracker API token. You can get it from your Pivotal Tracker profile.'

  const tokenPromise = window.showInputBox({ignoreFocusOut: true, password: true, placeHolder: 'Enter pivotal tracker API token', prompt})
  return tokenPromise.then(token => {
    if(!token) return onRej('Token not updated. Previous token set will be used.')

    window.showInformationMessage('Validating token')

    validate('token', context, true, 'Invalid token. Make sure you have copied the right value').then(_didValidationSucceed => {
      context.globalState.update(common.globals.APItoken, token)
      window.showInformationMessage('Pivotal Tracker API token updated successfully')
      validate('projectID', context, true, 'Invalid ProjectID. Please pick a valid project.').then(_didProjectValidationSucceed => {
        if (context.workspaceState.get(common.globals.isARepo)) validateStory(context)
        else validate('story', context, true).then(didSucceed => {}, didFail => {})
      }, _failedProjectValidationValue => {})
    }, _failedTokenValidationValue => {})
  },
  _rej => onRej('Token not set. You will not be able to use all pivotaly features')
  )
}

module.exports = registerToken
