const {getStory} = require("./stories")
const {getProject} = require("./projects")
const {updateState} = require("./stories")

exports.model = {
  getStory,
  getProject,
  updateState
}
