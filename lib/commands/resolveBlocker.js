const PtBlocker = require('../../model/blockers')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/state')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedResolveBlocker')
  const storyId = getState(context).story
  const blockerResource = new PtBlocker(context, storyId, taskTreeItem.itemId)
  let delivery
  try {
    delivery = await blockerResource.updateBlocker({resolved: true})
  } catch (error) {
    return rebounds('failedResolveBlocker')
  }
  if(delivery.res.statusCode === 200) {
    await rebounds('resolvedBlocker', context)
    taskTreeItem.dataProvider.refresh()
    return
  } else {
    return rebounds('failedResolveBlocker')
  }
}
