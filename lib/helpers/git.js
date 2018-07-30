const {workspace} = require("vscode")
const simpleGit = require("simple-git")(workspace.rootPath)

exports.getActiveBranch = () => new Promise((resolve, reject) => {
  simpleGit.branchLocal((err, branchSummary) => {
    console.log(branchSummary)
    !!err ? reject(err) : resolve(branchSummary.current)
  })
})
