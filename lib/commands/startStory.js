const {window} = require('vscode')
const PtStory = require('../../model/stories')
const {getState} = require('../helpers/state')
const rebounds = require('../validation/rebounds')
const {common} = require('./common')
const {getAllBranches, checkoutToBranch} = require('../helpers/git')
const {validateStory} = require('../validation/validate')

exports.startStory = async (context, storyInfoDataProvider ,backlogTreeItem) => {
  if(backlogTreeItem) {
    return startStoryFromBacklogViewlet(context, storyInfoDataProvider, backlogTreeItem)
  }
  const storyId = getState(context).story
  const storyResource = new PtStory(context, storyId)
  let res
  try {
    res = (await storyResource.updateStory({current_state: 'started'})).res  
  } catch (error) {
    return rebounds('failedStartStory', context)    
  }
  if(res.statusCode === 200) {
    storyInfoDataProvider.refresh()
    return rebounds('startedStory', context)
  }
  return rebounds('failedStartStory', context)
}

const startStoryFromBacklogViewlet = async (context, storyInfoDataProvider, backlogTreeItem) => {
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  if(isARepo) {
    const checkoutOptions = {
      sameBranch: 'Start story in current branch',
      existingBranch: 'Start story in existing branch',
      newBranch: 'Start story in new branch'
    }
    const checkOutOption = await window.showQuickPick([checkoutOptions.sameBranch, checkoutOptions.existingBranch, checkoutOptions.newBranch])
    const branches = await getAllBranches()
    if(checkOutOption === checkoutOptions.existingBranch) {
      const branchToUse = await window.showQuickPick(branches, {
        canPickMany: false,
        placeHolder: "Choose branch to use"
      })
      try {
        await checkoutToBranch(context, branchToUse, validateStory, context, storyInfoDataProvider)
      } catch (err) {
        // some rebound
      }
    }
    if(checkOutOption === checkoutOptions.newBranch) {
      const newBranch = window.showInputBox({
        prompt: "Enter new branch name",
        value: backlogTreeItem.id
      })
      const checkOutFrom = window.showQuickPick(branches, {
        canPickMany: false,
        placeHolder: "Choose branch to check out from"
      })
      // ask for new branch
      // check out to new branch
    }
  }
    // start story
    // this.startStory(context)
}
