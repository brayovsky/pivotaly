const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {commands} = require('../../commands')
const PivotalyDataProvider = require('../PivotalyDataProvider')

class ControlPanelDataProvider extends PivotalyDataProvider {
  /**
   * @param {object} context
   * @param {import("vscode").TreeDataProvider} storyInfoDataProvider story info view
   * @param {import("vscode").TreeDataProvider} cycleTimeDataProvider member cycle view
   * @param {boolean} isPtProject flag to show if the workspace has been marked as a Pivotal Tracker Project or not
   */
  constructor(context, storyInfoDataProvider, cycleTimeDataProvider, isPtProject = true) {
    super(context)
    this._storyInfoDataProvider = storyInfoDataProvider
    this._cycleTimeDataProvider = cycleTimeDataProvider
    this.isPtProject = isPtProject
  }

  /**
   * @param {object} _element
   */
  async getChildren(_element) {
    if(this.isPtProject) {
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
    const reinstateWorkspace = new TreeItem('Reinstate Workspace as a Pivotal Tracker Project', TreeItemCollapsibleState.None)
    reinstateWorkspace.command = {
      title: 'Reinstate Workspace',
      command: commands.internal.reinstateWorkspace,
      arguments: [this._context]
    }
    return [reinstateWorkspace]
  }
}

module.exports = ControlPanelDataProvider
