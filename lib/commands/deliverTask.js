const PtTask = require('../../model/tasks')
const rebounds = require('../validation/rebounds')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedDeliveredTask')
  const storyId = taskTreeItem.associatedStory.id
  const taskResource = new PtTask(context, storyId, taskTreeItem.itemId)
  let delivery
  try {
    delivery = await taskResource.updateTask({complete: true})
  } catch (error) {
    return rebounds('failedDeliveredTask')    
  }
  if(delivery.res.statusCode === 200) {
    await rebounds('deliveredTask', context)
    taskTreeItem.dataProvider.refresh()
    return
  }
  else {
    return rebounds('failedDeliveredTask')
  }
}
