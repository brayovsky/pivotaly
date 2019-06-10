const {TreeItem} = require('vscode')

class TaskAndBlockerTreeItem extends TreeItem {
  constructor(label, StoryDataProvider, contextValues) {
    super(label)
    this.dataProvider = StoryDataProvider
    [this.contextValue, this.itemId] = contextValues.split('-')
  }

  get taskOrBlockerContext() {
    return `${this.contextValue}-${this.itemId}`
  }
}

module.exports = TaskAndBlockerTreeItem
