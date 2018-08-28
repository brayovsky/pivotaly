const _ = require('lodash')
const renderMemberCard = require('./templates/prepareUserCard')

module.exports = members => {
  let renderedData = ''
  _.forEach(members, member => {
    renderedData += renderMemberCard(member)
  })
  return renderedData
}
