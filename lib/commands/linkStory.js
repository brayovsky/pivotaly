const {window, workspace} = require("vscode")
const {setState} = require("../helpers/pivotaly")
const {getActiveBranch} = require("../helpers/git")
const {validate} = require("../validation/validate")
const {rebounds} = require("../validation/rebounds")
const {common} = require("../commands/common")

const validateStoryID = (context, isARepo) =>
  isARepo ? validate("linkStory", context) : validate("story", context)

const linkStory = async (context) => {
  const storyID = await window.showInputBox({
    prompt: "Enter story ID for current branch",
    ignoreFocusOut: true})
  
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  const branch = isARepo ? await getActiveBranch() : undefined

  await setState(context, branch, storyID)
  
  const shouldLink = await validateStoryID(context, isARepo)
  if(!shouldLink) {
    // no state
    await setState(context, undefined, undefined)
    return rebounds('failedLinkedStory', context)
  }
  return rebounds('linkedStory', context)
}

module.exports = {
  linkStory
}
