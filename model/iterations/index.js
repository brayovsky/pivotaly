const Model = require('../')

class PtIterations extends Model{
  constructor(context, maxIterations) {
    super(context)
    this._baseIterationsPath = `${this._baseApiPath}/iterations`
    this._maxIterations = maxIterations
  }

  get _endpoints() {
    return {
      getIterations: scope => this._addParams(this._baseIterationsPath, {scope, offset: (0 - this._maxIterations), limit: this._maxIterations + 1}),
      getIterationCycleTime: iterationNumber => `${this._baseIterationsPath}/${iterationNumber}/analytics/cycle_time_details`
    }
  }

  getIterations(scope = 'done_current') {
    if(!['done', 'current', 'backlog', 'current_backlog', 'done_current'].includes(scope)) throw new Error('Invalid scope')
    return this._fetch('get', this._endpoints.getIterations(scope))
  }

  getIterationCycleTime(iterationNumber) {
    return this._fetch('get', this._endpoints.getIterationCycleTime(iterationNumber))
  }
}

module.exports = PtIterations
