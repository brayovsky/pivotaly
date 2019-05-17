const {window} = require('vscode')
const {setState} = require('../helpers/state')
const {getActiveBranch} = require('../helpers/git')
const {validate} = require('../validation/validate')
const rebounds = require('../validation/rebounds')
const {common} = require('../commands/common')
const PtIterations = require('../../model/iterations')
const {generateQuickPickArray, extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')

const validateStoryID = (context, isARepo) =>
  isARepo ? validate('linkStory', context) : true

const linkStory = async context => {
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  const shouldLink = await validateStoryID(context, isARepo)
  if(!shouldLink) return rebounds('failedLinkedStory', context)

  const iterationsResource = new PtIterations(context)
  let currentBacklog
  try {
    currentBacklog = (await iterationsResource.getIterations({scope: 'current_backlog', limit: 1000})).data    
  } catch (error) {
    return window.showErrorMessage('Failed to get stories')
  }
  const currentBacklogStories = []
  currentBacklog.map(iteration => Array.prototype.push.apply(currentBacklogStories, iteration.stories))
  const storiesQuickPick = generateQuickPickArray(currentBacklogStories)

  const storyLinked = await window.showQuickPick(
      storiesQuickPick,
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
  return rebounds('linkedStory', context)
}

module.exports = {
  linkStory
}
