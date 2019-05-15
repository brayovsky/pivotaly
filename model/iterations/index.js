const Model = require('../')

class PtIterations extends Model{
  constructor(context) {
    super(context)
    this._baseIterationsPath = `${this._baseApiPath}/iterations`
  }

  get _endpoints() {
    return {
      getIterations: (scope, maxIterations) => this._addParams(this._baseIterationsPath, {scope, offset: (0 - maxIterations), limit: maxIterations + 1}),
      getIterationCycleTime: iterationNumber => `${this._baseIterationsPath}/${iterationNumber}/analytics/cycle_time_details`
    }
  }

  getIterations(scope = 'done_current', maxIterations) {
    if(!['done', 'current', 'backlog', 'current_backlog', 'done_current'].includes(scope)) throw new Error('Invalid scope')
    return this._fetch('get', this._endpoints.getIterations(scope, maxIterations))
  }

  getIterationCycleTime(iterationNumber) {
    return this._fetch('get', this._endpoints.getIterationCycleTime(iterationNumber))
  }
}

module.exports = PtIterations
