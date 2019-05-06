const PtTask = require('../../model/tasks')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/state')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedDeliveredTask')
  const storyId = getState(context).story
  const taskResource = new PtTask(context, storyId, taskTreeItem.itemId)
  const delivery = await taskResource.updateTask({complete: true})
  if(delivery.res.statusCode === 200) {
    await rebounds('deliveredTask', context)
    taskTreeItem.dataProvider.refresh()
    return
  }
  else {
    return rebounds('failedDeliveredTask')
  }
}
