const moment = require('moment')

class DateFormatter {
  static formatDate(date, format) {
    return moment(date).format(format)
  }
}

module.exports = DateFormatter
