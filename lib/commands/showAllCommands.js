const vscode = require("vscode");
const _ = require("lodash")
const transformCommandToUserText = require("../adapters/transformCommandToUserText")
const {commands} = require("../commands/commands")

function getAllKeys(obj) {
  return _.keys(obj)
}

function getAllStoryCommands(){
  let allStoryCommands = _.concat(getAllKeys(commands.storyState), getAllKeys(commands.ptState), getAllKeys(commands.workState))
  allStoryCommands.forEach(function(val, index){
    allStoryCommands[index] = transformCommandToUserText.transformForUser(val)
  })
  return allStoryCommands
}

exports.showAllCommands = function() {
  let userCommands = getAllStoryCommands()
  let pickedItem = vscode.window.showQuickPick(userCommands, { canPickMany: false, ignoreFocusOut: true, placeHolder: "Select Action"})
  pickedItem.then(function(command) {
    let commandString = transformCommandToUserText.reverseCommandFromUser(command)
    let allCommands = _.assign({}, commands.storyState, commands.ptState, commands.workState)
    vscode.commands.executeCommand(allCommands[commandString])
  })
}
