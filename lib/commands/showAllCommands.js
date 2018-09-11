const {window, commands} = require("vscode")
const {getState} = require("../helpers/pivotaly")
const {storyState, workState, statistics} = require("./commands").commands
const getAllKeys = require('../adapters/getAllKeys')
const {model} = require('../../model')

const textToCommandMapping = {
  "$(triangle-right)\tStart Story": storyState.startStory,
  "$(primitive-square)\tStop Story": storyState.stopStory,
  "$(check)\tFinish Story": storyState.finishStory,
  "$(briefcase)\tDeliver Story": storyState.deliverStory,
  "$(link)\tLink Story": workState.linkStory,
  "$(history)\tMembers Cycle Time (Current iteration)": statistics.cycleTime
}

const getAllStoryCommands = () => getAllKeys(textToCommandMapping)

module.exports = async context => {
  const state = getState(context)
  const userCommands = getAllStoryCommands()
  const placeHolder = state.story ? `(${state.story}) ${state.storyDetails.name}` : `Pick action`
  const pickedItem = window.showQuickPick(userCommands, { canPickMany: false, ignoreFocusOut: true, placeHolder})
  pickedItem.then(action =>
    commands.executeCommand(textToCommandMapping[action], context)
  )
}
