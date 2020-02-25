const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const PtTask = require('../../../model/tasks')
const PtBlocker = require('../../../model/blockers')
const PivotalyTreeItem = require('../PivotalyTreeItem')
const PivotalyDataProvider = require('../PivotalyDataProvider')
const commandRepo = require('../../commands')
const {getState} = require('../../helpers/state')

class StoryInfoDataProvider extends PivotalyDataProvider {
  constructor(context) {
    super(context)
  }

  /**
   * Note: Blockers and Tasks have children while the rest return are an uncollapsible TreeItem
   * @param {any} element element to derive children from
   * @returns {Promise<Array>} Array of tree items for the passed element
   *
   */
  async getChildren(element) {
    if (!this._storyId) return [new TreeItem('No active story')]
    if(element) return this._getExpandableChild(element)

    const description = new TreeItem('View Description')
    description.command = {
      command: commandRepo.commands.storyState.showStoryDescription,
      title: 'View description',
      arguments: [this._story.description || '*This story has no description*']
    }

    const Tasks = new PivotalyTreeItem('Tasks', this, 'taskTitle-#', TreeItemCollapsibleState.Expanded)
    Tasks.iconPath = {
      light: this._context.asAbsolutePath('images/octicons/checklist.svg'),
      dark: this._context.asAbsolutePath('images/octicons/checklist-light.svg')
    }

    const Blockers = new PivotalyTreeItem('Blockers', this, 'blockerTitle-#', TreeItemCollapsibleState.Expanded)
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

  refresh() {
    const state = getState(this._context)
    this._storyId = state.story
    this._story = state.storyDetails
    super.refresh()
  }

  async _getExpandableChild(element) {
    if(element.label === 'Tasks') {
      const storyTasks = await this._fetchResource(PtTask, 'getAllTasks', [this._context, this._storyId], [])
      return this._getTreeItemsFromDescriptions(storyTasks, element.label)
    }

    if(element.label === 'Blockers') {
      const storyBlockers = await this._fetchResource(PtBlocker, 'getBlockers', [this._context, this._storyId], [])
      return this._getTreeItemsFromDescriptions(storyBlockers, element.label)
    }
    return []
  }

  _getTreeItemsFromDescriptions(items, label) {
    const treeItems = items.map(item => {
      let rawContextValue
      if(label === 'Tasks'){
        rawContextValue = item.complete ? `completeTask-${item.id}` : `incompleteTask-${item.id}`
      }
      if(label === 'Blockers'){
        rawContextValue = item.resolved ? `resolvedBlocker-${item.id}` : `unresolvedBlocker-${item.id}`
      }
      return new PivotalyTreeItem(item.description, this, rawContextValue)
    })
    return treeItems.length ? treeItems : [new TreeItem(`No ${label.toLowerCase()} yet`)]
  }
}

module.exports = StoryInfoDataProvider
