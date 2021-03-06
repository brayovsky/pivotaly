const {window} = require('vscode')
const PtStory = require('../../model/stories')
const {getState, setState} = require('../helpers/state')
const rebounds = require('../validation/rebounds')
const {common} = require('./common')
const {getAllBranches, checkoutToBranch, checkoutFromBranch, getActiveBranch} = require('../helpers/git')
const {validateStory} = require('../validation/validate')
const {isBranchDefault} = require('../validation/validators/isBranchDefault')

const isDefaultBranch = async (context, branch) => !(await isBranchDefault(context, branch))

/**
 * Starts the current story or provided story in the backlog tree item
 * @param {object} context Extension host context object
 * @param {object} storyInfoDataProvider StoryInfoDataProvider instance
 * @param {object} [backlogTreeItem] Backlog view TreeItem instance
 */
const startStory = async (context, storyInfoDataProvider, backlogTreeItem) => {
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

/**
 * Starts the current in the backlog tree item
 * @param {object} context Extension host context object
 * @param {object} storyInfoDataProvider StoryInfoDataProvider instance
 * @param {object} backlogTreeItem Backlog view TreeItem instance
 */
const startStoryFromBacklogViewlet = async (context, storyInfoDataProvider, backlogTreeItem) => {
  const isARepo = context.workspaceState.get(common.globals.isARepo)
  let newBranch = ''
  if(isARepo) {
    const branches = await getAllBranches()
    const checkoutOptions = {
      'Start story in current branch': async () => startStoryInCurrentBranch(context),
      'Start story in existing branch': async () => checkOutExistingBranch(context, storyInfoDataProvider, branches),
      'Start story in new branch': async () => checkOutNewBranch(context, storyInfoDataProvider, backlogTreeItem, branches)
    }
    const option = await window.showQuickPick(Object.keys(checkoutOptions))
    if(!option) return rebounds('failedStartStory', context, 'Could not start story')

    try {
      newBranch = await checkoutOptions[option]()
    } catch(err) {
      return rebounds('checkOutFailed', context, err.message)
    }
  }
  afterCheckout(context, newBranch, storyInfoDataProvider, backlogTreeItem)
}

const startStoryInCurrentBranch = async (context) => {
  const currentBranch = await getActiveBranch()
  const isCurrentBranchDefault = await isDefaultBranch(context, currentBranch)

  if (isCurrentBranchDefault) {
    throw new Error('You are in a protected branch. Switch to a feature branch to start story')
  }

  return ''
}

/**
 * Checks out to an existing branch
 * @param {object} context Extension host context object
 * @param {object} storyInfoDataProvider StoryInfoDataProvider instance
 * @param {Array<string>} branches All branches in the repository
 * @returns {Promise<string>} Branch checked out to
 */
const checkOutExistingBranch = async (context, storyInfoDataProvider, branches) => {
  const newBranch = await window.showQuickPick(branches, {
    canPickMany: false,
    placeHolder: "Choose branch to use"
  })
  
  const isPickedBranchDefault = await isDefaultBranch(context, newBranch)

  if(!newBranch || isPickedBranchDefault)
    throw new Error('Could not create new branch. You might have picked a protected branch')

  await checkoutToBranch(context, newBranch, validateStory, context, storyInfoDataProvider)

  return newBranch
}

/**
 * Creates a new branch and checks out to the new branch
 * @param {object} context Extension host context object
 * @param {object} storyInfoDataProvider StoryInfoDataProvider instance
 * @param {object} backlogTreeItem Backlog view TreeItem instance
 * @param {Array<string>} branches All branches in the repository
 * @returns {Promise<string>} Branch checked out to
 */
const checkOutNewBranch = async (context, storyInfoDataProvider, backlogTreeItem, branches) => {
  const newBranch = await window.showInputBox({
    prompt: "Enter new branch name",
    value: backlogTreeItem.id,
    validateInput: input => 
      branches.includes(input) ? 'This branch already exists' : ''
  })
  if(!newBranch) throw new Error('No branch was entered')

  const checkOutFrom = await window.showQuickPick(branches, {
    canPickMany: false,
    placeHolder: "Choose branch to check out from"
  })
  if(!checkOutFrom) throw new Error('No branch was selected to check out from')

  await setState(context, newBranch, backlogTreeItem.id)
  await checkoutFromBranch(context, newBranch, checkOutFrom, validateStory, context, storyInfoDataProvider)

  return newBranch
}

/**
 * Starts a story after checking out to a different branch
 * @param {object} context Extension host context object
 * @param {string} newBranch Branch checked out to or empty string if branch was not changed
 * @param {object} storyInfoDataProvider StoryInfoDataProvider instance 
 * @param {object} backlogTreeItem Backlog view TreeItem instance
 */
const afterCheckout = async (context, newBranch, storyInfoDataProvider, backlogTreeItem) => {
  await setState(context, newBranch, backlogTreeItem.id)
  startStory(context, storyInfoDataProvider)
}

module.exports = startStory
