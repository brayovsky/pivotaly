const clients = require('restify-clients')
const {getProject, getAllProjects} = require("./projects")
const {getIterations, getIterationCycleTime} = require("./iterations")
const {getMemberships} = require("./accounts")
const {getAllTasks, deliverTask, undeliverTask} = require('./tasks')
const {getBlockers, resolveBlocker, unresolveBlocker} = require('./blockers')
const {common} = require('../lib/commands/common')

const model = {
  getProject,
  getAllProjects,
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

class Model {
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
          // TODO: might need to assess type of error first before resolving
          resolve({res})
          return
        }
        resolve({res, data})
      })
    })
  }

  _update(method, path, updateData) {
    return new Promise(resolve => {
      this._pivotalTrackerClient[method]({path, headers: {
        'X-TrackerToken': this._token
      }},
      updateData,
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

module.exports = {
  model,
  Model,
}
