const {model} = require('../../model')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/pivotaly')

module.exports = async (taskTreeItem, context) => {
  const storyId = getState(context).story
  const delivery = await model.deliverTask(context, storyId, taskTreeItem.itemId)
  if(delivery.res.statusCode === 200)
    rebounds('deliveredTask', context)
  else
    rebounds('failedDeliveredTask')
}
