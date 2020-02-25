const clipboardy = require('clipboardy')
const rebounds = require('../validation/rebounds')

/**
 * Copies an element to the clipboard. Its string representation or id property will be copied.
 * @param {any} text Element to copy. 
 * @param {object} context Extension host context object
 */
const copy = (text, context) => {
  let textToCopy = text
  if(typeof text === 'object') {
    textToCopy = text.id || text
  }
  clipboardy.write(textToCopy.toString())
  .then(
    () => rebounds('successCopy', context, `Copied ${textToCopy} to clipboard`),
    () => rebounds('failedCopy', context)
  )
}

module.exports = copy
