const _ = require('lodash')

exports.normaliseFields = function(fields) {
  if(! _.isArray(fields)) fields = String(fields).split(",")
  return fields
}
