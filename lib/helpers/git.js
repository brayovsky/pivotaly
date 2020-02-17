const {workspace} = require("vscode")
const simpleGit = require("simple-git")(workspace.workspaceFolders[0].uri.fsPath)
const {common} = require('../commands/common')

let checkoutIntervalId
const getActiveBranch = () => new Promise((resolve, reject) =>
  simpleGit.branchLocal((err, branchSummary) =>
    !!err ? reject(err) : resolve(branchSummary.current)))

/**
 * @param {{ workspaceState: { get: (arg0: string) => any; }; }} context
 * @param {(arg0: any) => void} callBack
 * @param {any[]} cbArgs
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

const getAllBranches = () => new Promise((resolve, reject) =>
  simpleGit.branchLocal((err, branchSummary) =>
    !!err ? reject(err) : resolve(branchSummary.all)))


const checkoutToBranch = async (context, branch, checkoutCallBack, ...cbArgs) => {
  if(checkoutIntervalId) clearInterval(checkoutIntervalId)
  return new Promise((resolve, reject) =>
    simpleGit.checkout(branch, (err, data) => {
      listenForCheckOut(context, checkoutCallBack, ...cbArgs)
      return !!err ? reject(err) : resolve(data)
    }))
}

module.exports = {
  getActiveBranch,
  listenForCheckOut,
  getAllBranches,
  checkoutToBranch
}
