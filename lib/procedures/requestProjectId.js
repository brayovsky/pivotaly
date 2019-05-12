const {commands, window} = require("vscode")
const commandRepo = require("../commands/commands")

/**
 * @param {string} msg display message
 * @param {Array} args command arguments
 */
module.exports = (msg, args) => {
  window.showWarningMessage(msg)
  commands.executeCommand(commandRepo.commands.internal.registerProjectID, args)
}
