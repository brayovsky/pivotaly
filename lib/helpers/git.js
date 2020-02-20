const {workspace} = require("vscode")
const simpleGit = require("simple-git")(workspace.workspaceFolders[0].uri.fsPath)
const {common} = require('../commands/common')

let checkoutIntervalId
/**
 * Gets the current git branch in the directory
 * @returns {Promise<string>} Promise that resolves to a string of the current branch name
 */
const getActiveBranch = () => new Promise((resolve, reject) =>
  simpleGit.branchLocal((err, branchSummary) =>
    !!err ? reject(err) : resolve(branchSummary.current)))

/**
 * Listens for a branch change using polling
 * @param {object} context Extension host context object
 * @param {(...args:any) => any} callBack Function to callback after a successful checkout
 * @param {...any} cbArgs callback arguments
 */
const listenForCheckOut = async (context, callBack, ...cbArgs) => {

  let previousBranch = await getActiveBranch()
  
  if(context.workspaceState.get(common.globals.notPTProject)) {
    checkoutIntervalId = setInterval(async () => {
      const currentBranch = await getActiveBranch()
      if (currentBranch != previousBranch && callBack) {
          callBack(...cbArgs)
      }
      previousBranch = currentBranch
    }, 2000)
  }
}

/**
 * Gets an array of all git branches in the directory
 * @returns {Promise<string[]>} Promise that resolves to an array of all branches
 */
const getAllBranches = () => new Promise((resolve, reject) =>
  simpleGit.branchLocal((err, branchSummary) =>
    !!err ? reject(err) : resolve(branchSummary.all)))

/**
 * Checks out to supplied branch name
 * @param {object} context Extension host context object
 * @param {string} branch Branch to check out to
 * @param {(...args:any) => {}} checkoutCallBack Function to call after checkout
 * @param  {...any} cbArgs Arguments to pass to callback function
 * @returns {Promise<any>} Promise that resolves to data returned after git checkout command
 */
const checkoutToBranch = async (context, branch, checkoutCallBack, ...cbArgs) => {
  if(checkoutIntervalId) clearInterval(checkoutIntervalId)

  return new Promise((resolve, reject) =>
    simpleGit.checkout(branch, (err, data) => {
      listenForCheckOut(context, checkoutCallBack, ...cbArgs)
      return !!err ? reject(err) : resolve(data)
    }))
}

/**
 * Creates and checks out to a new branch
 * @param {object} context Extension host context object
 * @param {string} newBranchName New branch name
 * @param {string} fromBranchName Branch to check out from
 * @param {(...args:any) => {}} checkoutCallBack Function to call after checkout
 * @param  {...any} cbArgs Arguments to pass to callback function
 * @returns {Promise<any>} Promise that resolves to data returned after git checkout command
 */
const checkoutFromBranch = async (context, newBranchName, fromBranchName, checkoutCallBack, ...cbArgs) => {
  if(checkoutIntervalId) clearInterval(checkoutIntervalId)

  return new Promise((resolve, reject) => 
    simpleGit.checkoutBranch(newBranchName, fromBranchName, (err, data) => {
      listenForCheckOut(context, checkoutCallBack, ...cbArgs)
      return !!err ? reject(err) : resolve(data)
    }))
}

module.exports = {
  getActiveBranch,
  listenForCheckOut,
  getAllBranches,
  checkoutToBranch,
  checkoutFromBranch
}
