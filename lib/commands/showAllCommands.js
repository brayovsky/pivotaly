const {window, commands} = require("vscode")
const _ = require('lodash')
const {getState} = require("../helpers/state")
const {storyState, workState} = require("./commands").commands
const getAllKeys = require('../adapters/getAllKeys')

module.exports = async (context, storyInfoProvider) => {
  const textToCommandMapping = {
    storyState: {
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
      }
    },
    workState: {
      "$(link)\tLink Story": {
        command: workState.linkStory,
        args: [context, storyInfoProvider]
      }
    }
  }
  
  const getCommands = key => getAllKeys(textToCommandMapping[key])

  const state = getState(context)
  const placeHolder = state.story ? `(${state.story}) ${state.storyDetails.name}` : `Pick action`
  
  const commandTypes = Object.keys(textToCommandMapping)
  const mashedCommands = {}
  const allCommands = commandTypes.reduce((prev, current, index) => {
    if(index === 1) {
      Object.assign(mashedCommands, textToCommandMapping[prev], textToCommandMapping[current])
      return Object.keys(textToCommandMapping[prev]).concat(Object.keys(textToCommandMapping[current]))
    }
    Object.assign(mashedCommands, textToCommandMapping[current])
    return prev.concat(Object.keys(textToCommandMapping[current]))
  })

  const relevantCommands = state.story ? allCommands
   : _.difference(allCommands, getCommands('storyState'))

  const pickedItem = window.showQuickPick(relevantCommands, { canPickMany: false, ignoreFocusOut: true, placeHolder})
  pickedItem.then(action =>
    commands.executeCommand(mashedCommands[action].command, ...mashedCommands[action].args)
  )
}
