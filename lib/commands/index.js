const {commands} = require("./commands")
const {startStory} = require("./startStory")
const {stopStory} = require("./stopStory")
const {createStory} = require("./createStory")
const {deliverStory} = require("./deliverStory")
const {finishStory} = require("./finishStory")
const {linkStory} = require("./linkStory")

exports.commandRepo = {
  commands: commands,
  startStory: startStory,
  stopStory: stopStory,
  createStory: createStory,
  deliverStory: deliverStory,
  finishStory: finishStory,
  linkStory: linkStory
}
