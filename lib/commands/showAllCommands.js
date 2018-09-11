const {window, commands} = require("vscode")
const _ = require('lodash')
const {getState} = require("../helpers/pivotaly")
const {storyState, workState, statistics} = require("./commands").commands
const getAllKeys = require('../adapters/getAllKeys')
const {model} = require('../../model')

const textToCommandMapping = {
  storyState: {
    "$(triangle-right)\tStart Story": storyState.startStory,
    "$(primitive-square)\tStop Story": storyState.stopStory,
    "$(check)\tFinish Story": storyState.finishStory,
    "$(briefcase)\tDeliver Story": storyState.deliverStory
  },
  workState: {
    "$(link)\tLink Story": workState.linkStory
  },
  statistics: {
    "$(history)\tMembers Cycle Time (Current iteration)": statistics.cycleTime
  }
}

const getCommands = key => getAllKeys(textToCommandMapping[key])

module.exports = async context => {
  const state = getState(context)
  const placeHolder = state.story ? `(${state.story}) ${state.storyDetails.name}` : `Pick action`
  const allCommands =
  getCommands('storyState')
  .concat(getCommands('workState'))
  .concat(getCommands('statistics'))

  const relevantCommands = state.story ? allCommands
   : _.difference(allCommands, getCommands('storyState'))

  const mashedCommands = Object.assign({},
    textToCommandMapping.statistics,
    textToCommandMapping.storyState,
    textToCommandMapping.workState
    )

  const pickedItem = window.showQuickPick(relevantCommands, { canPickMany: false, ignoreFocusOut: true, placeHolder})
  pickedItem.then(action =>
    commands.executeCommand(mashedCommands[action], context)
  )
}
