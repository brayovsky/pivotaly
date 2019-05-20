const {window, commands} = require("vscode")
const _ = require('lodash')
const {getState} = require("../helpers/state")
const {storyState, workState} = require("./commands").commands
const getAllKeys = require('../adapters/getAllKeys')

module.exports = async (context, storyInfoProvider) => {
  const textToCommandMapping = {
    "$(triangle-right)\tStart Story": {
      command: storyState.startStory,
      args: [context]
    },
    "$(primitive-square)\tStop Story": {
      command: storyState.stopStory,
      args: [context]
    },
    "$(check)\tFinish Story": {
      command: storyState.finishStory,
      args: [context]
    },
    "$(briefcase)\tDeliver Story": {
      command: storyState.deliverStory,
      args: [context]
    },
    "$(link)\tLink Story": {
      command: workState.linkStory,
      args: [context, storyInfoProvider]
    }
  }
  
  const getCommands = key => getAllKeys(textToCommandMapping[key])

  const state = getState(context)
  const placeHolder = state.story ? `(${state.story}) ${state.storyDetails.name}` : `Pick action`
  const allCommands = getAllKeys(textToCommandMapping)

  const relevantCommands = state.story ? allCommands
   : _.difference(allCommands, getCommands('storyState'))

  const pickedItem = window.showQuickPick(relevantCommands, { canPickMany: false, ignoreFocusOut: true, placeHolder})
  pickedItem.then(action =>
    commands.executeCommand(textToCommandMapping[action].command, ...textToCommandMapping[action].args)
  )
}
