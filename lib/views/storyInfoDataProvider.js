const {TreeItem, TreeItemCollapsibleState, EventEmitter} = require('vscode')
const {getState} = require('../helpers/pivotaly')
const {model} = require('../../model')
const TaskAndBlockerTreeItem = require('./taskAndBlockerTreeItem')

class StoryInfoDataProvider {
  constructor(context) {
    this._story = getState(context).storyDetails
    this._context = context
    this._onDidChangeTreeData = new EventEmitter()
    this.onDidChangeTreeData = this._onDidChangeTreeData.event
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
      light: this._context.asAbsolutePath('images/octicons/checklist.svg'),
      dark: this._context.asAbsolutePath('images/octicons/checklist-light.svg')
    }

    const Blockers = new TreeItem('Blockers', TreeItemCollapsibleState.Collapsed)
    Blockers.iconPath = {
      light: this._context.asAbsolutePath('images/octicons/alert.svg'),
      dark: this._context.asAbsolutePath('images/octicons/alert-light.svg')
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

  refresh() {
    this._onDidChangeTreeData.fire()
  }

  _getTreeItemsFromDescriptions(items, label) {
    const treeItems = items.map(item => {
      const treeItem =  new TaskAndBlockerTreeItem(item.description, this)
      treeItem.taskOrBlockerContext = this._generateContextValue(item)
      return treeItem
    })
    return treeItems.length ? treeItems : [new TreeItem(`No ${label} yet`)]
  }

  _generateContextValue(item) {
    // task
    if(item.hasOwnProperty('complete')){
      return item.complete ? `completeTask-${item.id}` : `incompleteTask-${item.id}`
    }
    // blocker
    if(item.hasOwnProperty('resolved')){
      return item.resolved ? `resolvedBlocker-${item.id}` : `unresolvedBlocker-${item.id}`
    }
  }
}

module.exports = StoryInfoDataProvider
