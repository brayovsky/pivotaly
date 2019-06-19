const Model = require('../')
const {generateQuickPickArray} = require('../../lib/adapters/generateQuickPickArray')

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

  async getDoneIterations(scope = 'done_current', maxIterations, compress = false) {
    if(!['done', 'current', 'backlog', 'current_backlog', 'done_current'].includes(scope)) throw new Error('Invalid scope')
    if(!scope.includes('done')) return this.getIterations({scope})
    const iterations = await this._fetch('get', this._endpoints.getDoneIterations(scope, maxIterations))
    if(!compress) return iterations
    return this.compressIterations(iterations.data)
  }

  async getIterations(params, compress = false) {
    if(params.scope && !['current', 'backlog', 'current_backlog'].includes(params.scope)) throw new Error('Invalid scope')
    const iterations = await this._fetch('get', this._endpoints.getIterations(params))
    if(!compress) return iterations
    return this.compressIterations(iterations.data)
  }

  getIterationCycleTime(iterationNumber) {
    return this._fetch('get', this._endpoints.getIterationCycleTime(iterationNumber))
  }

  /**
   * Compress iterations to stories only with format {name - id}
   * 
   * @param {array} iterations all iterations returned from _fetch
   * @returns {array} compressed iterations
   */
  compressIterations(iterations) {
    const scopeStories = []
    iterations.forEach(iteration => Array.prototype.push.apply(scopeStories, iteration.stories))
    return generateQuickPickArray(scopeStories)
  }
}

module.exports = PtIterations
