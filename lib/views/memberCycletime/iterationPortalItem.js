const {formatDate} = require('../../utils/date')


class IterationPortalItem {
  constructor(iteration) {
    this.year = this._getYear(iteration.start)
    this.month = this._getMonth(iteration.start)
    this.iterationNumber = iteration.number
    this.label = `${formatDate(iteration.start, 'DD-MMM-YYYY')} to ${formatDate(iteration.finish, 'DD-MMM-YYYY')}`
  }

  _getYear(startDate) {
    return formatDate(startDate, 'YYYY')
  }

  _getMonth(startDate) {
    return formatDate(startDate, 'MMMM')
  }
}

module.exports = IterationPortalItem
