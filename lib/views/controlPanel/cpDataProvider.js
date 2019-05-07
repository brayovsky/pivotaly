const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {commands} = require('../../commands')

class ControlPanelDataProvider {
  /**
   * @param {object} context
   * @param {import("vscode").StatusBarItem} statusBarItem
   */
  constructor(context, statusBarItem) {
    this._context = context;
    this._statusBarItem = statusBarItem
  }

  /**
   * @param {object} _element
   */
  async getChildren(_element) {
    const editToken = new TreeItem('Edit token', TreeItemCollapsibleState.None)
    editToken.command = {
      title: 'Edit or add token',
      command: commands.internal.registerToken,
      arguments: [this._context, this._statusBarItem]
    }
    const editProject = new TreeItem('Edit project', TreeItemCollapsibleState.None)
    editProject.command = {
      title: 'Edit or add project',
      command: commands.internal.registerProjectID,
      arguments: [this._context, this._statusBarItem]
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
