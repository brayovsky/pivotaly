const {EventEmitter} = require('vscode')
const {getState} = require('../helpers/state')

class PivotalyDataProvider {
  constructor(context) {
    this._context = context
    this._onDidChangeTreeData = new EventEmitter()
    this.onDidChangeTreeData = this._onDidChangeTreeData.event
    const state = getState(this._context)
    this._storyId = state.story
    this._story = state.storyDetails
  }

  set story(newStory) {
    this._story = newStory
    this._storyId = newStory.id
  }

  get story() {
    return this._story
  }

  async getChildren() {
    return []
  }

  getTreeItem(child) {
    return child
  }

  /**
   * Fetch data from a model for a TreeItem
   * @param {Object} Model A model class to fetch data from
   * @param {string} method Method to use to fetch data
   * @param {Array<any>} modelArgs Model constructor arguments
   * @param {Array<any>} methodArgs Method arguments
   * @returns Data fetched
   */
  async _fetchResource(Model, method, modelArgs, methodArgs) {
    const Resource = new Model(...modelArgs)
    let data
    try {
      data = (await Resource[method](...methodArgs)).data
    } catch (error) {
      return []
    }
    return data
  }

  /**
   * Triggers view to update
   */
  refresh() {
    this._onDidChangeTreeData.fire()
  }
}

module.exports = PivotalyDataProvider
