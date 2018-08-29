const _ = require('lodash')
const prepareUserCard = require('./templates/prepareUserCard')

module.exports = members => {
  let renderedData = ''
  _.forEach(members, member => {
    renderedData += prepareUserCard(member)
  })
  return renderedData
}
