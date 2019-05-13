const moment = require('moment')

class DateUtil {
  static formatDate(date, format) {
    return moment(date).format(format)
  }

  /**
   * 
   * @param {string | object | Date} time utc time string or moment or Date object
   * @param {number} difference number of units ago
   * @param {string} unit unit of time e.g.'months', 'seconds'
   */
  static isBefore(time, difference, unit) {
    return moment(time).isBefore(moment().subtract(difference, unit))
  }
}

module.exports = DateUtil
