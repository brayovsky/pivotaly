const vscode = require("vscode")
const {common} = require("../commands/common")

exports.registerToken = function(context) {
  vscode.window.showWarningMessage("You have not provided a pivotal-tracker api token or your token is expired. Please add one.")
  const tokenPromise = vscode.window.showInputBox({ignoreFocusOut: true, password: true, placeHolder: "Enter pivotal tracker API token", prompt: "You have not provided a pivotal-tracker api token or your token is expired. Please add one."})
  tokenPromise.then(function(token){
    context.globalState.update(common.globals.APItoken, token)
    vscode.window.showInformationMessage("Pivotal tracker API Token updated successfully")
  },
  function(rej){
    vscode.window.showInformationMessage("Pivotal tracker API token could not be updated")
  })
}
