exports.normaliseFields = function(fields) {
  if(! Array.isArray(fields)) fields = String(fields).split(",")
  return fields
}
