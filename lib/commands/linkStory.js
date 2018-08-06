const {window} = require("vscode")
const {setState} = require("../helpers/pivotaly")
const {getActiveBranch} = require("../helpers/git")
const {validate} = require("../validation/validate")
const {getState} = require("../helpers/pivotaly")
const {rebounds} = require("../validation/rebounds")

exports.linkStory = async (context) => {
  const storyID = await window.showInputBox({
    prompt: "Enter story ID for current branch",
    ignoreFocusOut: true})
  
  const branch = await getActiveBranch()
  const prevStory = getState(context).story
  await setState(context, branch, storyID)

  const shouldLink = await validate("linkStory", context)

  if(!shouldLink) {
    // reset state
    await setState(context, branch, prevStory)
    return rebounds('failedLinkedStory', context)
  }
  return rebounds('failedLinkedStory', context)
}
