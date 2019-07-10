/**
 * 
 * @param {string} itemName Name to get plural of
 * @param {number} count item count
 */
const getPlural = (itemName, count) => {
  if(count === 1) return itemName
  if(['z', 'v'])
  return itemName.slice(-1) === 'y' ? `${itemName.slice(0, -1)}ies` : `${itemName}s`
}

module.exports = {
  getPlural
}