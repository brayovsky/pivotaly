const clipboardy = require('clipboardy')
const rebounds = require('../validation/rebounds')

const copy = (text, context) => {
  let textToCopy = text
  if(typeof text === 'object') {
    textToCopy = text.hasOwnProperty('id') ? text.id.toString() : text.toString()
  }
  clipboardy.write(textToCopy)
  .then(
    () => rebounds('successCopy', context, `Copied ${textToCopy} to clipboard`),
    () => rebounds('failedCopy', context)
  )
}

module.exports = copy
