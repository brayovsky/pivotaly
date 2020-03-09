const {commands, window} = require('vscode')
const {common} = require('../commands/common')
const {validate} = require('../validation/validate')
const commandStrings = require('./commands')
const {executeCommands} = require('../helpers/workspace')

const onRej = msg => window.showWarningMessage(msg)

const saveToken = (context, token) => context.globalState.update(common.globals.APItoken, token)

const registerToken = async context => {
  const prompt = 'Please provide a valid Pivotal Tracker API token. You can get it from your Pivotal Tracker profile.'

  const token =  await window.showInputBox({ignoreFocusOut: true, password: true, placeHolder: 'Enter pivotal tracker API token', prompt})

  if(!token) return

  window.showInformationMessage('Validating token')

  const previousToken = context.globalState.get(common.globals.APItoken, null)
  await saveToken(context, token)


  try {
    await validate('token', context, true, 'Invalid token. Make sure you have copied the right value')
  } catch(e) {
    saveToken(context, previousToken)
    const msg = !e ?
      'Invalid token. Make sure you have copied the right value':
      'Token not updated. Previous token set will be used.'
    onRej(msg)
    return
  }

  try {
    await validate('projectID', context, true, 'Invalid ProjectID. Please pick a valid project.')
    executeCommands(
      commandStrings.commands.workState.linkStory,
      commandStrings.commands.storyState.refreshMemberCycleView,
      commandStrings.commands.storyState.refreshBacklog
    )
  } catch (e) {
    return
  }
}

module.exports = registerToken
