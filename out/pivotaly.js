const {createPTStatusBarItem} = require("../lib/pivotaly/createPTStatusBarItem")

function activate(context) {
  let PTStatusBarItem = createPTStatusBarItem()

  context.subscriptions.push(PTStatusBarItem);
}
exports.activate = activate;


function deactivate() {
  // clean up
}
exports.deactivate = deactivate;
