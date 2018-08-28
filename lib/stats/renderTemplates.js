const _ = require('lodash')
const renderMemberCard = require('./templates/userCard')

module.exports = members => {
  let renderedData = ''
  _.forEach(members, member => {
    renderedData += renderMemberCard(member)
  })
  return renderedData
}
