const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {getState} = require('../helpers/pivotaly')
const {model} = require('../../model')
const path = require('path')

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

    const Tasks = new TreeItem('Tasks', TreeItemCollapsibleState.Collapsed)
    Tasks.iconPath = {
      light: path.join(this._context.extensionPath, 'images/octicons/checklist.svg'),
      dark: path.join(this._context.extensionPath, 'images/octicons/checklist-light.svg')
    }

    const Blockers = new TreeItem('Blockers', TreeItemCollapsibleState.Collapsed)
    Blockers.iconPath = {
      light: path.join(this._context.extensionPath, 'images/octicons/alert.svg'),
      dark: path.join(this._context.extensionPath, 'images/octicons/alert-light.svg')
    }
    
    return [
      new TreeItem(`Project ID: ${this._story.project_id}`),
      new TreeItem(`ID: ${this._story.id}`),
      new TreeItem(`Name: ${this._story.name}`),
      new TreeItem(`Type: ${this._story.story_type}`),
      new TreeItem(`State: ${this._story.current_state}`),
      Tasks,
      Blockers
    ]
  }

  getTreeItem(child) {
    return child
  }

  _getTreeItemsFromDescriptions(items, label) {
    const treeItems = items.map(item => {
      const treeItem =  new TreeItem(item.description)
      treeItem.contextValue = this._generateContextValue(item)
      return treeItem
    })
    return treeItems.length ? treeItems : [new TreeItem(`No ${label} yet`)]
  }

  _generateContextValue(item) {
    // task
    if(item.hasOwnProperty('complete')){
      return item.complete ? 'completeTask' : 'incompleteTask'
    }
    // blocker
    if(item.hasOwnProperty('resolved')){
      return item.resolved ? 'resolvedBlocker' : 'unresolvedBlocker'
    }
  }
}

module.exports = StoryInfoDataProvider
