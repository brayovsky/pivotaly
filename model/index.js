const clients = require('restify-clients')
const {common} = require('../lib/commands/common')
const {normaliseFields} = require('../lib/adapters/normaliseFields')
const rebound = require('../lib/validation/rebounds')

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
    return new Promise((resolve, reject) => {
      this._pivotalTrackerClient[method]({path, headers: {
        'X-TrackerToken': this._token
      }},
      (err, req, res, data) => {
        if(err){
          if(err.statusCode === 403 && err.restCode === 'invalid_authentication')
            rebound('token', this._context)
          return reject(err.restCode)
        }
        resolve({res, data})
      })
    })
  }

  _update(method, path, updateData) {
    method = method.toLowerCase()
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

  _appendFields(path, fields) {
    fields = normaliseFields(fields).join()
    return fields.length > 0 ? `${path}?fields=${fields}` : path
  }
}

module.exports = Model
