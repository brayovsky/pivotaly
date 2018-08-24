const {commands} = require("./commands")
const {startStory} = require("./startStory")
const {stopStory} = require("./stopStory")
const {deliverStory} = require("./deliverStory")
const {finishStory} = require("./finishStory")
const {linkStory} = require("./linkStory")
const showAllCommands = require("./showAllCommands")
const {registerToken} = require("./registerToken")
const {registerProjectID} = require("./registerProjectID")

exports.commandRepo = {
  commands,
  startStory,
  stopStory,
  deliverStory,
  finishStory,
  linkStory,
  showAllCommands,
  registerToken,
  registerProjectID
}
