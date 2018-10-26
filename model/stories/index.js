const {Model} = require('../index')

class PtStory extends Model {
  constructor(context, storyId){
    super(context)
    this.storyId = storyId
    this._baseStoryPath =  `${this._baseApiPath}/stories/${this.storyId}`
  }

  get _endpoints() {
    return {
      getStory: fields => this._appendFields(this._baseStoryPath, fields),
      updateStory: this._baseStoryPath
    }
  }

  getStory(fields = []) {
    return this._fetch('get', this._endpoints.getStory(fields))
  }

  updateStory(updateBody) {
    return this._update('put', this._endpoints.updateStory, updateBody)
  }
}

module.exports = PtStory
