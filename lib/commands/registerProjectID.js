const vscode = require("vscode")
const {common} = require("../commands/common")

function onFailure(){
  vscode.window.showInformationMessage("Current project ID could not be updated")
}
exports.registerProjectID = function(context) {
  const prompt = "You have not provided a functional project ID. Please add one."
  vscode.window.showWarningMessage(prompt)
  const projectIDPromise = vscode.window.showInputBox({ignoreFocusOut: true, placeHolder: "Enter project ID", prompt})
  projectIDPromise.then(function(id){
    if(!id){
      onFailure()
      return
    }
    context.workspaceState.update(common.globals.projectID, id)
    vscode.window.showInformationMessage("Project ID updated successfully")
  },
  function(rej){
    onFailure()
  })
}
