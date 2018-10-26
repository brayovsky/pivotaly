const {Model} = require('../index')
const {normaliseFields} = require("../../lib/adapters/normaliseFields")

class PtStory extends Model {
  constructor(context, storyId){
    super(context)
    this.storyId = storyId
    this._baseStoryPath =  `${this._baseApiPath}/stories/${this.storyId}`
  }

  get _endpoints() {
    return {
      getStory: (fields) => {
        fields = normaliseFields(fields).join()
        const endpoint = `${this._baseStoryPath}?`
        return fields ? endpoint + `fields=${fields}` : endpoint
      },
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
