const vscode = require("vscode");

exports.createPTStatusBarItem = function() {
  let PTStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right)
  PTStatusBarItem.text = "Pivotaly"
  // PTStatusBarItem.command = show all pt commands
  PTStatusBarItem.show()
  return PTStatusBarItem
}
