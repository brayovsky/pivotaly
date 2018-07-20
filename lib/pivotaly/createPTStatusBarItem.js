const vscode = require("vscode");
const {commands} = require("../commands/commands")

exports.createPTStatusBarItem = function() {
  let PTStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)
  PTStatusBarItem.text = "Pivotaly"
  PTStatusBarItem.command = commands.internal.showCommandsQuickPick
  PTStatusBarItem.show()
  return PTStatusBarItem
}
