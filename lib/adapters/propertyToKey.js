module.exports = (data, prop) => {
  // Given an array of obj, 
  // it should convert it to an object with prop as keys
  const finalObj = {}
  data.forEach(val =>
    finalObj[val[prop]] = val
  )
  return finalObj
}
