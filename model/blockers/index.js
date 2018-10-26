const {Model} = require('../')

class PtBlocker extends Model {
  constructor(context, storyId, blockerId) {
    super(context)
    this._baseBlockerPath = `${this._baseApiPath}/stories/${storyId}/blockers`
    this.blockerId = blockerId
  }

  get endpoints() {
    return {
      getBlockers: this._baseBlockerPath,
      updateBlocker: `${this._baseBlockerPath}/${this.blockerId}`
    }
  }

  getBlockers() {
    return this._fetch('get', this.endpoints.getBlockers)
  }

  updateBlocker(updateData) {
    return this._update('put', this.endpoints.updateBlocker, updateData)
  }
}

module.exports = PtBlocker