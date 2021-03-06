const {window} = require('vscode')
const {setState} = require('../helpers/state')
const {getActiveBranch} = require('../helpers/git')
const {validate} = require('../validation/validate')
const rebounds = require('../validation/rebounds')
const {common} = require('../commands/common')
const PtIterations = require('../../model/iterations')
const {extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')

const validateStoryID = (context, isARepo) =>
  isARepo ? validate('linkStory', context) : true

const linkStory = async (context, storyInfoProvider) => {
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  let shouldLink
  try {
    shouldLink = await validateStoryID(context, isARepo)
  } catch(err) {
    shouldLink = false
  }
  if(!shouldLink) return rebounds('failedLinkedStory', context)

  const iterationsResource = new PtIterations(context)
  let currentBacklog
  try {
    currentBacklog = await iterationsResource.getIterations({scope: 'current_backlog', limit: 1000}, true)
  } catch (error) {
    return window.showErrorMessage('Failed to get stories')
  }

  const storyLinked = await window.showQuickPick(
    currentBacklog,
    { 
      canPickMany: false,
      ignoreFocusOut: true,
      placeHolder: 'Pick the story you are working on'
    }
  )

  if(!storyLinked) return

  const storyID = extractIdFromQuickPick(storyLinked)
  const branch = isARepo ? await getActiveBranch() : undefined

  await setState(context, branch, storyID)
  return rebounds('linkedStory', context, '', [context, storyInfoProvider])
}

module.exports = {
  linkStory
}
