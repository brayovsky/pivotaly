const { TreeItem, TreeItemCollapsibleState, EventEmitter } = require('vscode')
const PtIterations = require('../../../model/iterations')

class CurrentAndBacklogDataProvider {
  constructor(context) {
    this._context = context
    this._onDidChangeTreeData = new EventEmitter()
    this.onDidChangeTreeData = this._onDidChangeTreeData.event
  }

  async getChildren() {
    const Iterations = new PtIterations(this._context)
    let current_backlog,
      stories = []
    try {
      current_backlog = (await Iterations.getIterations({
        scope: 'current_backlog'
      })).data
    } catch (e) {
      return []
    }
    current_backlog.forEach(iteration => {
      Array.prototype.push.apply(stories, iteration.stories)
    })

    return stories
  }

  getTreeItem (story) {
    if(story.length === 0) return new TreeItem('No Story Available', TreeItemCollapsibleState.None)
    return new TreeItem(story.name, TreeItemCollapsibleState.None)
  }

  refresh() {
    this._onDidChangeTreeData.fire()
  }
}

module.exports = CurrentAndBacklogDataProvider
