const { TreeItem, TreeItemCollapsibleState } = require('vscode')
const PtIterations = require('../../../model/iterations')
const PivotalyDataProvider = require('../PivotalyDataProvider')
const PivotalyTreeItem = require('../PivotalyTreeItem')
const StoryInfoProvider = require('../storyInfo/storyInfoDataProvider')

class CurrentAndBacklogDataProvider extends PivotalyDataProvider {
  constructor(context) {
    super(context)
  }

  async getChildren(element) {
    if (element) {
      const StoryInfoDataProvider = new StoryInfoProvider(this._context)
      const storyInfo = await StoryInfoDataProvider.getChildren()
      return storyInfo
    }

    const stories = []
    const current_backlog = await this._fetchResource(PtIterations, 'getIterations', [this._context], [{scope: 'current_backlog'}])
    current_backlog.forEach(iteration => Array.prototype.push.apply(stories, iteration.stories))

    return stories.length === 0 ? new TreeItem('No Story Available', TreeItemCollapsibleState.None) : stories
  }

  getTreeItem (story) {
    if(story instanceof TreeItem) return story
    if(story.id.toString() === this._storyId || story.story_type === 'release') return null
    return new PivotalyTreeItem(story.name, this, `backlogStory-${story.id}`, TreeItemCollapsibleState.Collapsed)
  }
}

module.exports = CurrentAndBacklogDataProvider
