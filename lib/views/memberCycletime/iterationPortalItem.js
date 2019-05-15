const {formatDate} = require('../../utils/date')


class IterationPortalItem {
  constructor(iteration) {
    this._iteration = iteration
  }

  get year() {
    return formatDate(this._iteration.start, 'YYYY')
  }

  get month() {
    return formatDate(this._iteration.start, 'MMMM')
  }

  get iterationNumber() {
    return this._iteration.number
  }

  get label() {
    return `${formatDate(this._iteration.start, 'DD-MMM-YYYY')} to ${formatDate(this._iteration.finish, 'DD-MMM-YYYY')}`
  }

  get iteration() {
    return this._iteration
  }
}

module.exports = IterationPortalItem
