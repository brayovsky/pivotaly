const {TreeItem} = require('vscode')

class TaskAndBlockerTreeItem extends TreeItem {
  constructor(label, StoryDataProvider) {
    super(label)
    this.dataProvider = StoryDataProvider
  }

  set taskOrBlockerContext(value) {
    const [contextValue, itemId] = value.split('-')
    this.contextValue = contextValue
    this.itemId =itemId
  }

  get taskOrBlockerContext() {
    return `${this.contextValue}-${this.itemId}`
  }
}

module.exports = TaskAndBlockerTreeItem
