const {model} = require('../../model')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/pivotaly')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedUnresolveBlocker')
  const storyId = getState(context).story
  const delivery = await model.unresolveBlocker(context, storyId, taskTreeItem.itemId)
  if(delivery.res.statusCode === 200) {
    await rebounds('unresolvedBlocker', context)
    taskTreeItem.dataProvider.refresh()
    return
  }
  else {
    return rebounds('failedUnresolveBlocker')
  }
}
