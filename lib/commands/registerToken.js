const {commands, window} = require('vscode')
const {common} = require('../commands/common')
const {validate} = require('../validation/validate')
const rebound = require('../validation/rebounds')
const commandStrings = require('./commands')

const onRej = msg => window.showWarningMessage(msg)

const registerToken = (context, storyInfoDataProvider, cycleTimeDataProvider) => {
  const prompt = 'Please provide a valid Pivotal Tracker API token. You can get it from your Pivotal Tracker profile.'

  const tokenPromise = window.showInputBox({ignoreFocusOut: true, password: true, placeHolder: 'Enter pivotal tracker API token', prompt})
  return tokenPromise.then(token => {
    if(!token) return onRej('Token not updated. Previous token set will be used.')

    window.showInformationMessage('Validating token')
    const previousToken = context.globalState.get(common.globals.APItoken, null)
    context.globalState.update(common.globals.APItoken, token)

    validate('token', context, true, 'Invalid token. Make sure you have copied the right value', [context, storyInfoDataProvider, cycleTimeDataProvider]).then(() => {
      window.showInformationMessage('Pivotal Tracker API token updated successfully')
      validate('projectID', context, true, 'Invalid ProjectID. Please pick a valid project.', [context, storyInfoDataProvider, cycleTimeDataProvider]).then(() => {
        rebound('story', context, 'Pick story for project', [context, storyInfoDataProvider])
        commands.executeCommand(commandStrings.commands.storyState.refreshMemberCycleView, [cycleTimeDataProvider])
      }, () => {})
    }, () =>
      context.globalState.update(common.globals.APItoken, previousToken)
    )
  },
  () => onRej('Token not set. You will not be able to use all pivotaly features')
  )
}

module.exports = registerToken
