const {TreeItem, TreeItemCollapsibleState, EventEmitter} = require('vscode')
const {getState} = require('../../helpers/state')
const PtTask = require('../../../model/tasks')
const PtBlocker = require('../../../model/blockers')
const TaskAndBlockerTreeItem = require('./taskAndBlockerTreeItem')
const commandRepo = require('../../commands')

class StoryInfoDataProvider {
  constructor(context) {
    this._context = context
    this._getState()
    this._onDidChangeTreeData = new EventEmitter()
    this.onDidChangeTreeData = this._onDidChangeTreeData.event
  }

  _getState() {
    const state = getState(this._context)
    this._storyId = state.story
    this._story = state.storyDetails
  }

  async getChildren(element) {
    if (!this._storyId) return [new TreeItem('No active story')]
    if(element) return this._getExpandableChild(element)

    const description = new TreeItem('View Description')
    description.command = {
      command: commandRepo.commands.storyState.showStoryDescription,
      title: 'View description',
      arguments: [this._story.description]
    }

    const Tasks = new TreeItem('Tasks', TreeItemCollapsibleState.Expanded)
    Tasks.contextValue = 'taskTitle'
    Tasks.dataProvider = this
    Tasks.iconPath = {
      light: this._context.asAbsolutePath('images/octicons/checklist.svg'),
      dark: this._context.asAbsolutePath('images/octicons/checklist-light.svg')
    }

    const Blockers = new TreeItem('Blockers', TreeItemCollapsibleState.Expanded)
    Blockers.contextValue = 'blockerTitle'
    Blockers.dataProvider = this
    Blockers.iconPath = {
      light: this._context.asAbsolutePath('images/octicons/alert.svg'),
      dark: this._context.asAbsolutePath('images/octicons/alert-light.svg')
    }
    
    return [
      new TreeItem(`Project ID: ${this._story.project_id}`),
      description,
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
    this._getState()
    this._onDidChangeTreeData.fire()
  }

  async _getExpandableChild(element) {
    if(element.label === 'Tasks') {
      const taskResource = new PtTask(this._context, this._storyId)
      let storyTasks
      try {
        storyTasks = (await taskResource.getAllTasks()).data        
      } catch (error) {
        return []
      }
      return this._getTreeItemsFromDescriptions(storyTasks, 'tasks')
    }

    if(element.label === 'Blockers') {
      const blockersResource = new PtBlocker(this._context, this._storyId)
      let storyBlockers
      try {
        storyBlockers = (await blockersResource.getBlockers()).data        
      } catch (error) {
        return []
      }
      return this._getTreeItemsFromDescriptions(storyBlockers, 'blockers')
    }
    return []
  }

  _getTreeItemsFromDescriptions(items, label) {
    const treeItems = items.map(item => {
      return new TaskAndBlockerTreeItem(item.description, this, this._generateContextValue(item))
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
