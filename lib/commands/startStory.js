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
  // stop current story
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  if(isARepo) {
  const checkoutOptions = {
    sameBranch: 'Start story in current branch',
    existingBranch: 'Start story in existing branch',
    newBranch: 'Start story in new branch'
  }
  const checkOutOption = await window.showQuickPick([checkoutOptions.sameBranch, checkoutOptions.existingBranch, checkoutOptions.newBranch])
  if(checkOutOption === checkoutOptions.existingBranch) {
    const branches = await getAllBranches()
    const branchToUse = await window.showQuickPick(branches)
    try {
      await checkoutToBranch(context, branchToUse, validateStory, storyInfoDataProvider)
    } catch (err) {
      // some rebound
    }
  }
    // ask for new branch
    // check out to new branch
  }
  // start story
  // this.startStory(context)
}
