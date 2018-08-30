module.exports = (data, prop) => {
  const finalObj = {}
  data.forEach(val =>
    finalObj[val[prop]] = val
  )
  return finalObj
}
