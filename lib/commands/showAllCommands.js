const vscode = require("vscode")
const {getState} = require("../helpers/pivotaly")
const {commands} = require("../commands/commands")
const getAllKeys = require('../adapters/getAllKeys')

const textToCommandMapping = {
  "$(triangle-right)\tStart Story": commands.storyState.startStory,
  "$(primitive-square)\tStop Story": commands.storyState.stopStory,
  "$(check)\tFinish Story": commands.storyState.finishStory,
  "$(briefcase)\tDeliver Story": commands.storyState.deliverStory,
  "$(link)\tLink Story": commands.workState.linkStory,
}

const getAllStoryCommands = () => getAllKeys(textToCommandMapping)

module.exports = (context) => {
  const state = getState(context)
  const userCommands = getAllStoryCommands()
  const pickedItem = vscode.window.showQuickPick(userCommands, { canPickMany: false, ignoreFocusOut: true, placeHolder: `Select Action (Current Story: ${state.story})`})
  pickedItem.then((action) =>
    vscode.commands.executeCommand(textToCommandMapping[action], context)
  )
}
