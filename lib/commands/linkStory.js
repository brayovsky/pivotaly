const {window} = require('vscode')
const {setState, getState} = require('../helpers/pivotaly')
const {getActiveBranch} = require('../helpers/git')
const {validate} = require('../validation/validate')
const rebounds = require('../validation/rebounds')
const {common} = require('../commands/common')
const {model} = require('../../model')
const {generateQuickPickArray, extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')

const validateStoryID = (context, isARepo) =>
  isARepo ? validate('linkStory', context) : true // validate('story', context) will always be true

const linkStory = async context => {
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  const shouldLink = await validateStoryID(context, isARepo)
  if(!shouldLink) return rebounds('failedLinkedStory', context)

  const currentBacklog = (await model.getIterations(context, 'current_backlog')).data
  const currentBacklogStories = []
  currentBacklog.map(iteration => Array.prototype.push.apply(currentBacklogStories, iteration.stories))
  const storiesQuickPick = generateQuickPickArray(currentBacklogStories)

  const storyLinked = await window.showQuickPick(
      storiesQuickPick,
      { 
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'Enter story ID for current branch'
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
