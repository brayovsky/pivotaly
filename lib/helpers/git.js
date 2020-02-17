const {workspace} = require("vscode")
const simpleGit = require("simple-git")(workspace.workspaceFolders[0].uri.fsPath)
const GitEvents = require('../events/gitEvents')
const {common} = require('../commands/common')

let checkoutIntervalId
const getActiveBranch = () => new Promise((resolve, reject) =>
  simpleGit.branchLocal((err, branchSummary) =>
    !!err ? reject(err) : resolve(branchSummary.current)))

const listenForCheckOut = async (context, callBack) => {
  const gitEvents = new GitEvents()
  const args = [...arguments]

  gitEvents.on('checkout', () => {
    if(context.workspaceState.get(common.globals.notPTProject) && !callBack) return
    callBack(context, ...args.splice(args.length, args.length - 2))
  })

  let previousBranch = await getActiveBranch()
  checkoutIntervalId = setInterval(async () => {
    const currentBranch = await getActiveBranch()
    if (currentBranch != previousBranch) {
      gitEvents.emit('checkout')
    }
    previousBranch = currentBranch
  }, 2000)
}

const getAllBranches = () => new Promise((resolve, reject) =>
  simpleGit.branchLocal((err, branchSummary) =>
    !!err ? reject(err) : resolve(branchSummary.all)))


const checkoutToBranch = async (context, branch, checkoutCallBack) => {
  if(checkoutIntervalId) clearInterval(checkoutIntervalId)
  const funcArgs = [...arguments]
  return new Promise((resolve, reject) =>
    simpleGit.checkout(branch, (err, data) => {
      listenForCheckOut(context, checkoutCallBack, ...funcArgs.splice(funcArgs.length, funcArgs.length - 3))
      return !!err ? reject(err) : resolve(data)
    }))
}

module.exports = {
  getActiveBranch,
  listenForCheckOut,
  getAllBranches,
  checkoutToBranch
}
