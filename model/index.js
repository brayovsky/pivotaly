const {getStory} = require("./stories")
const {getProject} = require("./projects")
const {updateState} = require("./stories")
const {getIterations, getIterationCycleTime} = require("./iterations")
const {getMemberships} = require("./accounts")

exports.model = {
  getStory,
  getProject,
  updateState,
  getIterationCycleTime,
  getIterations,
  getMemberships,
}
