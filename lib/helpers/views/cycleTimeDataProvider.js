const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const {model} = require('../../../model')
const {commands} = require('../../commands')
const IterationPortalItem = require('./iterationPortalItem')

class CycleTimeTreeDataProvider {
  constructor(context) {
    this._context = context
    this._portal = {}
  }

  async getChildren(element) {
    if(element){
      // issamonth
      if(RegExp('^[a-zA-Z]+$').test(element.label))
        return this._getTreeIterations(element.year, element.label)
      return this._getMonths(element.label)
    }
    // start
    const iterations = await this._getIterations()
    this._createIterationPortal(iterations)
    const years = this._getYears()
    return years
  }

  getTreeItem(child) {
    return child
  }

  async _getIterations() {
    const iterations = await model.getIterations(this._context, 'done_current')
    return iterations.data
  }

  _createIterationPortal(iterations) {
    const portal = {}
    iterations.forEach(iteration => {
      const portalitem = new IterationPortalItem(iteration)
      if(portal.hasOwnProperty(portalitem.year)){
        if(portal[portalitem.year].hasOwnProperty(portalitem.month))
          portal[portalitem.year][portalitem.month].push(portalitem)      
        else
          portal[portalitem.year][portalitem.month] = [portalitem]
      } else {
        portal[portalitem.year] = {
          [portalitem.month]: [portalitem]
        }
      }
    })
    this._portal = portal
  }

  _getYears() {
    return Object.keys(this._portal).map(year => new TreeItem(year.toString(), TreeItemCollapsibleState.Collapsed))
  }

  _getMonths(year) {
    return Object.keys(this._portal[year]).map(month => new IterationMonth(month, TreeItemCollapsibleState.Collapsed, year))
  }

  _getTreeIterations(year, month) {
    return this._portal[year][month].map(iteration => new TreeItem(iteration.label, TreeItemCollapsibleState.None))
  }
}

class IterationMonth extends TreeItem {
  constructor(label, collapsibleState, year) {
    super(label, collapsibleState)
    this.year = year
  }
}

module.exports = CycleTimeTreeDataProvider
