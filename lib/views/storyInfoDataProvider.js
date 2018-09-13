const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {getState} = require('../helpers/pivotaly')

class StoryInfoDataProvider {
  constructor(context) {
    this._story = getState(context).storyDetails
  }
  getChildren(element) {
    // ifStoryDetails
    return [
      new TreeItem(`Project ID: ${this._story.project_id}`),
      new TreeItem(`ID: ${this._story.id}`),
      new TreeItem(`Name: ${this._story.name}`),
      new TreeItem(`Type: ${this._story.story_type}`),
      new TreeItem(`Description: ${this._story.description || ''}`),
      new TreeItem(`State: ${this._story.current_state}`)
    ]
  }

  getTreeItem(child) {
    return child
  }
}

module.exports = StoryInfoDataProvider
