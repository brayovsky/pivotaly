const _ = require('lodash')
const {isBefore} = require('../../utils/date')
const {TreeItem, TreeItemCollapsibleState} = require('vscode')
const PtIterations = require('../../../model/iterations')
const {commands} = require('../../commands')
const IterationPortalItem = require('./iterationPortalItem')
const {testMatch, expressions} = require('../../utils/regularExpressions')
const PivotalyDataProvider = require('../PivotalyDataProvider')

class CycleTimeTreeDataProvider extends PivotalyDataProvider{
  /**
   * 
   * @param {object} context extension host context
   * @param {number} maxPeriod maximum number of months to get iterations from
   * @param {string} scope scope of iterations
   */
  constructor(context, maxPeriod, scope) {
    super(context)
    this._context = context
    this._scope = scope
    this._portal = {}
    this._iterationsNotAvailableMessage = [new TreeItem(`There are no available iterations from the last ${maxPeriod} months.`)]
    this._maxPeriod = maxPeriod
    this._maxIterations = maxPeriod * 4 + maxPeriod // maximum iterations in given month
  }

  async getChildren(element) {
    if(element){
      // issamonth
      if(testMatch(element.label, expressions.alphabetsOnly))
        return this._getTreeIterations(element.year, element.label)
      return this._getMonths(element.label)
    }
    // start
    const iterations = await this._getIterations()
    if(iterations.length === 0) return this._iterationsNotAvailableMessage
    this._createIterationPortal(iterations)
    const years = this._getYears()
    if(years.length === 0) return this._iterationsNotAvailableMessage
    return years
  }

  async _getIterations() {
    return this._fetchResource(PtIterations, 'getDoneIterations', [this._context], [this._scope, this._maxIterations])
  }

  _createIterationPortal(iterations) {
    const portal = {}
    if(_.isArray(iterations))
      iterations.forEach(iteration => {
        if(isBefore(iteration.start, this._maxPeriod, 'months')) return
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
    return this._portal[year][month].map(iteration => {
      const iterationItem = new TreeItem(iteration.label, TreeItemCollapsibleState.None)
      iterationItem.command = {
        title: 'View Stats',
        command: commands.statistics.cycleTime,
        arguments: [this._context, iteration.iteration]
      }
      iterationItem.tooltip = 'View iteration stats'
      return iterationItem
    })
  }
}

class IterationMonth extends TreeItem {
  constructor(label, collapsibleState, year) {
    super(label, collapsibleState)
    this.year = year
  }
}

module.exports = CycleTimeTreeDataProvider
