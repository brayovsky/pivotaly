const vscode = require("vscode")
const {common} = require("../commands/common")

const onFailure = () => {
  vscode.window.showInformationMessage("Current project ID could not be updated")
}
exports.registerProjectID = (context) => {
  const prompt = "You have not provided a functional project ID for this workspace. Please add one."

  const projectIDPromise = vscode.window.showInputBox({ignoreFocusOut: true, placeHolder: "Enter project ID", prompt})
  return projectIDPromise.then((id) => {
    if(!id){
      onFailure()
      return
    }
    context.workspaceState.update(common.globals.projectID, id)
    vscode.window.showInformationMessage("Project ID updated successfully")
  },
  (rej) => {
    onFailure()
  })
}
