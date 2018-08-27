const {getStory} = require("./stories")
const {getProject} = require("./projects")
const {updateState} = require("./stories")
const {getIterations, getIterationCycleTime} = require("./iterations")

exports.model = {
  getStory,
  getProject,
  updateState,
  getIterationCycleTime,
  getIterations,
}
