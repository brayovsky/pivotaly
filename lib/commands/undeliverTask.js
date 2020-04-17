const PtTask = require('../../model/tasks')
const rebounds = require('../validation/rebounds')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedundeliveredTask')
  const storyId = taskTreeItem.associatedStory.id
  const taskResource = new PtTask(context, storyId, taskTreeItem.itemId)
  let delivery
  try {
    delivery = await taskResource.updateTask({complete: false})    
  } catch (error) {
    return rebounds('failedundeliveredTask')    
  }
  if(delivery.res.statusCode === 200){
    await rebounds('undeliveredTask', context)
    taskTreeItem.refresh()
    return    
  }
  else {
    return rebounds('failedundeliveredTask')
  }
}
