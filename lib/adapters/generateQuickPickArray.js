/**
 * Given an array with items with objects with name and id properties
 * the function maps the array to a string array of the id appended to the name
 * @example
 * // returns ['honda - 5']
 * generateQuickPickArray([{id: 5, name: honda}])
 */
const generateQuickPickArray = items => items.map(item => `${item.name} - ${item.id}`)


/**
 * Given a string with an id appended to it, it extracts the string
 * @example
 * // returns '5'
 * extractIdFromQuickPick('honda - 5')
 */
const extractIdFromQuickPick = item => item.split(' - ').reverse()[0]


module.exports = {
  generateQuickPickArray,
  extractIdFromQuickPick
}
