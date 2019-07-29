const {window} = require('vscode')
const Blocker = require('../../model/blockers')
const Iterations = require('../../model/iterations')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/state')
const {extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')

module.exports = async (taskTreeItem, context) => {
  const blockerOptions = ['Enter a blocker description', 'Pick a story blocker']
  const storyOrDescription = await window.showQuickPick(
    blockerOptions,
    { 
      canPickMany: false,
      ignoreFocusOut: false
    }
  )
  let description
  if(!storyOrDescription) return
  if(storyOrDescription === blockerOptions[0]) {
    description = await window.showInputBox({
      prompt: 'Enter blocker description'
    })
    if(!description) return
  } else if(storyOrDescription === blockerOptions[1]) {
    const iterationsResource = new Iterations(context)

    let currentBacklog
    try {
      currentBacklog = await iterationsResource.getIterations({scope: 'current_backlog', limit: 1000}, true) 
    } catch (error) {
      return window.showErrorMessage('Failed to get stories')
    }

    const storyPicked = await window.showQuickPick(
      currentBacklog,
      { 
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'Pick the blocking story'
      }
    )
    if(!storyPicked) return
    description = `#${extractIdFromQuickPick(storyPicked)}`
  }

  const storyId = getState(context).story
  const BlockerResource = new Blocker(context, storyId, null)
  let creation
  try{
    creation = await BlockerResource.createBlocker(description)
  } catch (error) {
    return rebounds('failedAddBlocker')
  }
  if(creation.res.statusCode === 200) {
    await rebounds('addBlocker', context)
    taskTreeItem.dataProvider.refresh()
    return
  }
  return rebounds('failedAddBlocker')
}
