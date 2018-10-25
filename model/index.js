const clients = require('restify-clients')
const {getStory} = require("./stories")
const {getProject, getAllProjects} = require("./projects")
const {updateState} = require("./stories")
const {getIterations, getIterationCycleTime} = require("./iterations")
const {getMemberships} = require("./accounts")
const {getAllTasks, deliverTask, undeliverTask} = require('./tasks')
const {getBlockers, resolveBlocker, unresolveBlocker} = require('./blockers')
const {common} = require('../lib/commands/common')
const {normaliseFields} = require('../lib/adapters/normaliseFields')

const model = {
  getStory,
  getProject,
  getAllProjects,
  updateState,
  getIterationCycleTime,
  getIterations,
  getMemberships,
  getAllTasks,
  getBlockers,
  deliverTask,
  undeliverTask,
  resolveBlocker,
  unresolveBlocker
}

class new_model {
  constructor(context) {
    this._context = context
    this._pivotalTrackerClient = clients.createJsonClient(common.globals.pivotalBaseUrl)
    const projectId = context.workspaceState.get(common.globals.projectID)
    this._baseApiPath = `${common.globals.pivotalApiPrefix}/projects/${projectId}`
    this._token = context.globalState.get(common.globals.APItoken)
  }

  _fetch(method, path) {
    method = method.toLowerCase()
    return new Promise(resolve => {
      this._pivotalTrackerClient[method]({path, headers: {
        'X-TrackerToken': this._token
      }},
      (err, req, res, data) => {
        if(err){
          resolve({res})
          return
        }
        resolve({res, data})
      })
    })
  }
}


class PtStory extends new_model {
  constructor(context, storyId){
    super(context)
    this.storyId = storyId
  }

  get _endpoints() {
    return {
      getStory: (fields) => {
        fields = normaliseFields(fields).join()
        const endpoint = `${this._baseApiPath}/stories/${this.storyId}?`
        return fields ? endpoint + `fields=${fields}` : endpoint
      }
    }
  }

  getStory(fields = []) {
    return this._fetch('get', this._endpoints.getStory(fields))
  }
}

module.exports = {
  model,
  new_model,
  PtStory
}
