const Model = require('../')

class PtIterations extends Model{
  constructor(context) {
    super(context)
    this._baseIterationsPath = `${this._baseApiPath}/iterations`
  }

  get _endpoints() {
    return {
      getDoneIterations: (scope, maxIterations) => this._addParams(this._baseIterationsPath, {scope, offset: (0 - maxIterations), limit: maxIterations + 1}),
      getIterations: params => this._addParams(this._baseIterationsPath, params),
      getIterationCycleTime: iterationNumber => `${this._baseIterationsPath}/${iterationNumber}/analytics/cycle_time_details`
    }
  }

  getDoneIterations(scope = 'done_current', maxIterations) {
    if(!['done', 'current', 'backlog', 'current_backlog', 'done_current'].includes(scope)) throw new Error('Invalid scope')
    if(!scope.includes('done')) return this.getIterations({scope})
    return this._fetch('get', this._endpoints.getDoneIterations(scope, maxIterations))
  }

  getIterations(params) {
    if(params.scope && !['current', 'backlog', 'current_backlog'].includes(params.scope)) throw new Error('Invalid scope')
    return this._fetch('get', this._endpoints.getIterations(params))
  }

  getIterationCycleTime(iterationNumber) {
    return this._fetch('get', this._endpoints.getIterationCycleTime(iterationNumber))
  }
}

module.exports = PtIterations
