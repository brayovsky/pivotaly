const {model} = require('../../model')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/pivotaly')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedundeliveredTask')
  const storyId = getState(context).story
  const delivery = await model.undeliverTask(context, storyId, taskTreeItem.itemId)
  if(delivery.res.statusCode === 200)
    return rebounds('undeliveredTask', context)
  else
    return rebounds('failedundeliveredTask')
}
