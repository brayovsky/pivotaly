const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {getState} = require('../helpers/pivotaly')
const {model} = require('../../model')

class StoryInfoDataProvider {
  constructor(context) {
    this._story = getState(context).storyDetails
    this._context = context
  }
  async getChildren(element) {
    if(element) {
      if(element.label == 'Tasks') {
        const storyTasks = (await model.getAllTasks(this._context, this._story.id)).data
        return this._getTreeItemsFromDescriptions(storyTasks, 'tasks')
      }

      if(element.label == 'Blockers') {
        const storyBlockers = (await model.getBlockers(this._context, this._story.id)).data
        return this._getTreeItemsFromDescriptions(storyBlockers, 'blockers')
      }

      return []
    }
    
    return [
      new TreeItem(`Project ID: ${this._story.project_id}`),
      new TreeItem(`ID: ${this._story.id}`),
      new TreeItem(`Name: ${this._story.name}`),
      new TreeItem(`Type: ${this._story.story_type}`),
      new TreeItem(`State: ${this._story.current_state}`),
      new TreeItem('Tasks', TreeItemCollapsibleState.Collapsed),
      new TreeItem('Blockers', TreeItemCollapsibleState.Collapsed)
    ]
  }

  getTreeItem(child) {
    return child
  }

  _getTreeItemsFromDescriptions(items, label) {
    const treeItems = []
    items.forEach(item => 
      treeItems.push(new TreeItem(item.description))
    )
    return treeItems.length ? treeItems : [new TreeItem(`No ${label} yet`)]
  }
}

module.exports = StoryInfoDataProvider
