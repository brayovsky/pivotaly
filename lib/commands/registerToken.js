const {commands, window} = require('vscode')
const {common} = require('../commands/common')
const {validate} = require('../validation/validate')
const commandStrings = require('./commands')

const onRej = msg => window.showWarningMessage(msg)

const saveToken = (context, token) => context.globalState.update(common.globals.APItoken, token)

// TODO: Remove unnnecessarry provider arguments
const registerToken = async (context, storyInfoDataProvider, cycleTimeDataProvider) => {
  const prompt = 'Please provide a valid Pivotal Tracker API token. You can get it from your Pivotal Tracker profile.'

  const token =  await window.showInputBox({ignoreFocusOut: true, password: true, placeHolder: 'Enter pivotal tracker API token', prompt})

  if(!token) return

  window.showInformationMessage('Validating token')

  const previousToken = context.globalState.get(common.globals.APItoken, null)
  saveToken(context, token)


  try {
    await validate('token', context, true, 'Invalid token. Make sure you have copied the right value', [context, storyInfoDataProvider, cycleTimeDataProvider])
  } catch(e) {
    saveToken(context, previousToken)
    const msg = !e ?
      'Invalid token. Make sure you have copied the right value':
      'Token not updated. Previous token set will be used.'
    onRej(msg)
    return
  }

  try {
    await validate('projectID', context, true, 'Invalid ProjectID. Please pick a valid project.', [context, storyInfoDataProvider, cycleTimeDataProvider])
    await commands.executeCommand(commandStrings.commands.workState.linkStory)
    commands.executeCommand(commandStrings.commands.storyState.refreshMemberCycleView)
  } catch (e) {
    return
  }
}

module.exports = registerToken
