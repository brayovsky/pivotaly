const {window} = require("vscode")
const {setState, getState} = require("../helpers/pivotaly")
const {getActiveBranch} = require("../helpers/git")
const {validate} = require("../validation/validate")
const rebounds = require("../validation/rebounds")
const {common} = require("../commands/common")

const validateStoryID = (context, isARepo) =>
  isARepo ? validate("linkStory", context) : validate("story", context)

const linkStory = async (context) => {
  const storyID = await window.showInputBox({
    prompt: "Enter story ID for current branch",
    ignoreFocusOut: true})

  if(!storyID) return
  
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  const branch = isARepo ? await getActiveBranch() : undefined

  const prevState = getState(context)
  await setState(context, branch, storyID)
  
  const shouldLink = await validateStoryID(context, isARepo)
  if(!shouldLink) {
    // no state
    await setState(context, prevState.branch, prevState.story)
    return rebounds('failedLinkedStory', context)
  }
  return rebounds('linkedStory', context)
}

module.exports = {
  linkStory
}
