const {window} = require('vscode')
const PtStory = require('../../model/stories')
const {getState, setState} = require('../helpers/state')
const rebounds = require('../validation/rebounds')
const {common} = require('./common')
const {getAllBranches, checkoutToBranch, checkoutFromBranch} = require('../helpers/git')
const {validateStory} = require('../validation/validate')

const startStory = async (context, storyInfoDataProvider ,backlogTreeItem) => {
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
    const branches = await getAllBranches()
    const checkoutOptions = {
      // 'Start story in current branch': () => afterCheckout(context, null, storyInfoDataProvider, backlogTreeItem),
      'Start story in existing branch': async () => checkOutExistingBranch(context, storyInfoDataProvider, branches, backlogTreeItem),
      'Start story in new branch': async () => checkOutNewBranch(context, storyInfoDataProvider, backlogTreeItem, branches)
    }
    await window.showQuickPick(Object.keys(checkoutOptions), {
        onDidSelectItem: async item => {
          await checkoutOptions[item]()
        }
      })
  }
}

const checkOutExistingBranch = async (context, storyInfoDataProvider, branches, backlogTreeItem) => {
  const newBranch = (await window.showQuickPick(branches, {
    canPickMany: false,
    placeHolder: "Choose branch to use"
  }))
  if(!newBranch) return onCheckOutErr()

  try {
    await checkoutToBranch(context, newBranch, validateStory, context, storyInfoDataProvider)
  } catch (err) {
    return onCheckOutErr()
  }
  afterCheckout(context, newBranch, storyInfoDataProvider, backlogTreeItem)
}

const checkOutNewBranch = async (context, storyInfoDataProvider, backlogTreeItem, branches) => {
  const newBranch = await window.showInputBox({
    prompt: "Enter new branch name",
    value: backlogTreeItem.id
  })
  if(!newBranch) return onCheckOutErr()


  const checkOutFrom = await window.showQuickPick(branches, {
    canPickMany: false,
    placeHolder: "Choose branch to check out from"
  })
  if(!checkOutFrom) return onCheckOutErr()

  try {
    await checkoutFromBranch(context, newBranch, checkOutFrom, validateStory, context, storyInfoDataProvider)
  } catch(err) {
    return onCheckOutErr()
  }
  afterCheckout(context, newBranch, storyInfoDataProvider, backlogTreeItem)
}

const afterCheckout = async (context, newBranch, storyInfoDataProvider, backlogTreeItem) => {
  await setState(context, newBranch, backlogTreeItem.id)
  startStory(context, storyInfoDataProvider)
}

const onCheckOutErr = (context = {}, msg = '') => {
  rebounds('checkOutFailed', context, msg)
}

module.exports = startStory
