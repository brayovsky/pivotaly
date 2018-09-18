const {model} = require('../../model')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/pivotaly')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedResolveBlocker')
  const storyId = getState(context).story
  const delivery = await model.resolveBlocker(context, storyId, taskTreeItem.itemId)
  if(delivery.res.statusCode === 200)
    return rebounds('resolvedBlocker', context)
  else
    return rebounds('failedResolveBlocker')
}
