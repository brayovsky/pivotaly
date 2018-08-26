const {getStory} = require("./stories")
const {getProject} = require("./projects")
const {updateState} = require("./stories")
const {getIterationCycleTime} = require("./iterations") 

exports.model = {
  getStory,
  getProject,
  updateState,
  getIterationCycleTime
}
