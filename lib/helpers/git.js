const {workspace} = require("vscode")
const simpleGit = require("simple-git")(workspace.workspaceFolders[0].uri.fsPath)

const getActiveBranch = () => new Promise((resolve, reject) => {
  simpleGit.branchLocal((err, branchSummary) => {
    !!err ? reject(err) : resolve(branchSummary.current)
  })
})

const listenForCheckOut = async gitEvents => {
  let previousBranch = await getActiveBranch()
  setInterval(async () => {
    const currentBranch = await getActiveBranch()
    if (currentBranch != previousBranch) {
      gitEvents.emit('checkout')
    }
    previousBranch = currentBranch
  }, 2000)
}

module.exports = {
  getActiveBranch,
  listenForCheckOut
}
