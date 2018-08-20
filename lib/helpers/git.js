const {workspace} = require("vscode")
const simpleGit = require("simple-git")(workspace.workspaceFolders[0].uri.fsPath)

exports.getActiveBranch = () => new Promise((resolve, reject) => {
  simpleGit.branchLocal((err, branchSummary) => {
    !!err ? reject(err) : resolve(branchSummary.current)
  })
})
