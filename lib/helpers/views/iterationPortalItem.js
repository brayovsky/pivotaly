const moment = require('moment')


class IterationPortalItem {
  constructor(iteration) {
    this.portalGroup = null
    this.year = this._getYear(iteration.start)
    this.month = this._getMonth(iteration.start)
    this.iterationNumber = iteration.number
    this.label = `${moment(iteration.start).format('DD-MMM-YYYY')} to ${moment(iteration.finish).format('DD-MMM-YYYY')}`
  }

  _getYear(startDate) {
    return moment(startDate).format('YYYY')
  }

  _getMonth(startDate) {
    return moment(startDate).format('MMMM')
  }
}

module.exports = IterationPortalItem
