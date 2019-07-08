const clients = require('restify-clients')
const _ = require('lodash')
const {common} = require('../lib/commands/common')
const {normaliseFields} = require('../lib/adapters/normaliseFields')
const requestToken = require('../lib/procedures/requestToken')

class Model {
  constructor(context) {
    this._context = context
    this._pivotalTrackerClient = clients.createJsonClient(common.globals.pivotalBaseUrl)
    this._projectId = context.workspaceState.get(common.globals.projectID)
    this._token = context.globalState.get(common.globals.APItoken)
  }

  get _baseApiPath(){
    return `${common.globals.pivotalApiPrefix}/projects/${this._projectId}`
  }

  _fetch(method, path) {
    method = method.toLowerCase()
    return new Promise((resolve, reject) => {
      this._pivotalTrackerClient[method]({path, headers: {
        'X-TrackerToken': this._token
      }},
      (err, req, res, data) => {
        if(err){
          if(err.statusCode === 403 && err.restCode === 'invalid_authentication') {
            requestToken('Invalid token detected', [this._context])
            return reject(err.restCode)
          }
        }
        resolve({res, data})
      })
    })
  }

  _update(method, path, updateData) {
    method = method.toLowerCase()
    return new Promise((resolve, reject) => {
      this._pivotalTrackerClient[method]({path, headers: {
        'X-TrackerToken': this._token
      }},
      updateData,
      (err, req, res, data) => {
        if(err){
          if(err.statusCode === 403 && err.restCode === 'invalid_authentication')
            requestToken('Invalid token detected', [this._context])
          return reject(err.restCode)
        }
        resolve({res, data})
      })
    })
  }

  _appendFields(path, fields) {
    fields = normaliseFields(fields).join()
    return fields.length > 0 ? `${path}?fields=${fields}` : path
  }

  /**
   * Adds parameters to a url string
   * @param {string} path url path
   * @param {object} params object with keys as param fields and values as their respective values
   * @returns {string} url appended with various params
   */
  _addParams(path, params) {
    if(path[path.length - 1] === '/') path = path.substring(0, path.length - 1)
    let paramString = ''
    _.forEach(params, (val, key) => {
      paramString += `${key}=${val}&`
    })
    const finalPath = `${path}?${paramString}`
    return paramString.length > 0 ? finalPath.substring(0, finalPath.length - 1) : path
  }
}

module.exports = Model
