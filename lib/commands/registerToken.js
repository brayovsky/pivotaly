const vscode = require("vscode")
const {common} = require("../commands/common")

exports.registerToken = function(context) {
  const prompt = "Please provide a valid Pivotal Tracker API token. You can get it from your Pivotal Tracker profile."
  // vscode.window.showWarningMessage(prompt)
  const tokenPromise = vscode.window.showInputBox({ignoreFocusOut: true, password: true, placeHolder: "Enter pivotal tracker API token", prompt})
  return tokenPromise.then(function(token){
    if(!token){
      return
    }
    context.globalState.update(common.globals.APItoken, token)
    vscode.window.showInformationMessage("Pivotal tracker API Token updated successfully")
  },
  function(rej){
    // pass
  })
}
