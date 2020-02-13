const { TreeItem, TreeItemCollapsibleState } = require('vscode')
const PtIterations = require('../../../model/iterations')
const PivotalyDataProvider = require('../PivotalyDataProvider')

class CurrentAndBacklogDataProvider extends PivotalyDataProvider {
  constructor(context) {
    super(context)
  }

  async getChildren() {
    const stories = []
    const current_backlog = await this._fetchResource(PtIterations, 'getIterations', [this._context], [{scope: 'current_backlog'}])
    current_backlog.forEach(iteration => Array.prototype.push.apply(stories, iteration.stories))
    
    return stories.length === 0 ? new TreeItem('No Story Available', TreeItemCollapsibleState.None) : stories
  }

  getTreeItem (story) {
    if(story instanceof TreeItem) return story
    return new TreeItem(story.name, TreeItemCollapsibleState.None)
  }
}

module.exports = CurrentAndBacklogDataProvider
