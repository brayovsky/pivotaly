const {Model} = require('../')
class PtProject extends Model {
  constructor(context) {
    super(context)
    this._baseProjectPath = this._baseApiPath
  }

  get _endpoints() {
    return {
      getProject: fields => this._appendFields(this._baseProjectPath, fields),
      getAllProjects: fields => this._appendFields(`/services/v5/projects`, fields)
    }
  }

  getProject(fields = []) {
    return this._fetch('get', this._endpoints.getProject(fields))
  }

  getAllProjects(fields = []) {
    return this._fetch('get', this._endpoints.getAllProjects(fields))
  }
}

module.exports = PtProject
