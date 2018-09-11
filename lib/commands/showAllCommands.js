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
  let currentStory
  currentStory = await model.getStory(context, state.story, ['name'])
  if (currentStory.res.statusCode === 200) {
    const pickedItem = window.showQuickPick(userCommands, { canPickMany: false, ignoreFocusOut: true, placeHolder: `(${currentStory.data.id}) ${currentStory.data.name}`})
    pickedItem.then((action) =>
      commands.executeCommand(textToCommandMapping[action], context)
    )
  } else {
    commands.executeCommand(workState.linkStory, context)
  }
}
