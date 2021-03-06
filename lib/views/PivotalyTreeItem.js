const {TreeItem, TreeItemCollapsibleState} = require('vscode')

class PivotalyTreeItem extends TreeItem {
  /**
   * General TreeItem for tree items passed to commands
   * @param {string} label Label for the TreeItem
   * @param {Object} dataProvider TreeDataProvider instance upon which the tree item can call refresh
   * @param {string} contextString context value string to generate contextValue
   */
  constructor(label, dataProvider, contextString = '-', collapsibleState = TreeItemCollapsibleState.None) {
    super(label, collapsibleState)
    this.dataProvider = dataProvider
    const splitValues = contextString.split('-')
    this.contextValue = splitValues[0]
    this.itemId = splitValues[1]
    this.associatedStory = dataProvider.story
  }

  get contextString() {
    return `${this.contextValue}-${this.itemId}`
  }

  /**
   * Represent the item as a string
   * @returns {string} The itemId property
   */
  toString() {
    return this.itemId
  }

  refresh() {
    this.dataProvider.refresh()
  }
}

module.exports = PivotalyTreeItem
