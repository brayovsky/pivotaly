const clients = require('restify-clients')
const _ = require('lodash')
const {common} = require('../lib/commands/common')
const {normaliseFields} = require('../lib/adapters/normaliseFields')
const rebounds = require('./rebounds')

class Model {
  constructor(context) {
    this._context = context
    this._pivotalTrackerClient = clients.createJsonClient(common.globals.pivotalBaseUrl)
    this._projectId = context.workspaceState.get(common.globals.projectID)
    this._token = context.globalState.get(common.globals.APItoken, ' ')
    this.retryLimit = 3
  }

  get _baseApiPath(){
    return `${common.globals.pivotalApiPrefix}/projects/${this._projectId}`
  }
  
  _fetch(method, path) {
    return this.callApi(method, path)
  }
  
  _update(method, path, updateData) {
    return this.callApi(method, path, updateData)
  }
  
  /**
   * 
   * @param {string} method 
   * @param {string} path 
   * @param {object} updateData 
   * @returns {promise}
   */
  callApi(method, path, updateData = null, noOftries = 1){
    const params = []
    method = method.toLowerCase();
    params.push({
      path,
      headers: {
        'X-TrackerToken': this._token
      }
    })
  
    updateData && params.push(updateData)

    return new Promise((resolve, reject) => {
      this._pivotalTrackerClient[method](
        ...params,
        (err, req, res, data) => {
          if(err){
            return rebounds(err, this._context)
            .then(redo => {
              if(redo) {
                noOftries++ === this.retryLimit ? reject(err.restCode || err.code) :
                  resolve(this.callApi(method, path, updateData, noOftries))
              } else
                reject(err.restCode || err.code)
            })
          }
          resolve({res, data})
        })
    })
  };

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
