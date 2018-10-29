const PtStory = require('../stories')

class PtBlocker extends PtStory {
  constructor(context, storyId, blockerId) {
    super(context, storyId)
    this._baseBlockerPath = `${this._baseStoryPath}/blockers`
    this.blockerId = blockerId
  }

  get _blockerEndpoints() {
    return {
      ...this._endpoints,
      getBlockers: this._baseBlockerPath,
      updateBlocker: `${this._baseBlockerPath}/${this.blockerId}`
    }
  }

  getBlockers() {
    return this._fetch('get', this._blockerEndpoints.getBlockers)
  }

  updateBlocker(updateData) {
    return this._update('put', this._blockerEndpoints.updateBlocker, updateData)
  }
}

module.exports = PtBlocker
