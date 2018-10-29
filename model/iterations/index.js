const {Model} = require('../')

class PtIterations extends Model{
  constructor(context) {
    super(context)
    this._baseIterationsPath = `${this._baseApiPath}/iterations`
  }

  get _endpoints() {
    return {
      getIterations: scope => `${this._baseIterationsPath}?scope=${scope}`,
      getIterationCycleTime: iterationNumber => `${this._baseIterationsPath}/${iterationNumber}/analytics/cycle_time_details`
    }
  }

  getIterations(scope = '') {
    return this._fetch('get', this._endpoints.getIterations(scope))
  }

  getIterationCycleTime(iterationNumber) {
    return this._fetch('get', this._endpoints.getIterationCycleTime(iterationNumber))
  }
}

module.exports = PtIterations
