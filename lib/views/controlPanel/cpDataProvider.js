const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {commands} = require('../../commands')

class ControlPanelDataProvider {
  /**
   * @param {object} context
   * @param {import("vscode").TreeDataProvider} storyInfoDataProvider story info view
   * @param {import("vscode").TreeDataProvider} cycleTimeDataProvider member cycle view 
   */
  constructor(context, storyInfoDataProvider, cycleTimeDataProvider) {
    this._context = context
    this._storyInfoDataProvider = storyInfoDataProvider
    this._cycleTimeDataProvider = cycleTimeDataProvider
  }

  /**
   * @param {object} _element
   */
  async getChildren(_element) {
    const editToken = new TreeItem('Edit token', TreeItemCollapsibleState.None)
    editToken.command = {
      title: 'Edit or add token',
      command: commands.internal.registerToken,
      arguments: [this._context, this._storyInfoDataProvider, this._cycleTimeDataProvider]
    }
    const editProject = new TreeItem('Edit project', TreeItemCollapsibleState.None)
    editProject.command = {
      title: 'Edit or add project',
      command: commands.internal.registerProjectID,
      arguments: [this._context, this._storyInfoDataProvider, this._cycleTimeDataProvider]
    }
    return [editToken, editProject]
  }

  /**
   * @param {any} child
   */
  getTreeItem(child) {
    return child
  }
}

module.exports = ControlPanelDataProvider
