const {model} = require('../../model')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/pivotaly')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedundeliveredTask')
  const storyId = getState(context).story
  const delivery = await model.undeliverTask(context, storyId, taskTreeItem.itemId)
  if(delivery.res.statusCode === 200){
    await rebounds('undeliveredTask', context)
    taskTreeItem.dataProvider.refresh()
    return    
  }
  else {
    return rebounds('failedundeliveredTask')
  }
}
