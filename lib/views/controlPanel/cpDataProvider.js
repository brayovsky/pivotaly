const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {commands} = require('../../commands')

class ControlPanelDataProvider {
  /**
   * @param {object} context
   * @param {import("vscode").TreeDataProvider} storyInfoDataProvider story info view
   */
  constructor(context, storyInfoDataProvider) {
    this._context = context
    this._storyInfoDataProvider = storyInfoDataProvider
  }

  /**
   * @param {object} _element
   */
  async getChildren(_element) {
    const editToken = new TreeItem('Edit token', TreeItemCollapsibleState.None)
    editToken.command = {
      title: 'Edit or add token',
      command: commands.internal.registerToken,
      arguments: [this._context, this._storyInfoDataProvider]
    }
    const editProject = new TreeItem('Edit project', TreeItemCollapsibleState.None)
    editProject.command = {
      title: 'Edit or add project',
      command: commands.internal.registerProjectID,
      arguments: [this._context, this._storyInfoDataProvider]
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
