const {TreeItem} = require('vscode')

class TaskAndBlockerTreeItem extends TreeItem {
  constructor(label, StoryDataProvider, contextValues) {
    super(label)
    this.dataProvider = StoryDataProvider
    const splitValues = contextValues.split('-')
    this.contextValue = splitValues[0]
    this.itemId = splitValues[1]
  }

  get taskOrBlockerContext() {
    return `${this.contextValue}-${this.itemId}`
  }
}

module.exports = TaskAndBlockerTreeItem
