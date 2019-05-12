const PtTask = require('../../model/tasks')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/state')

module.exports = async (taskTreeItem, context) => {
  if(!taskTreeItem.hasOwnProperty('itemId')) return rebounds('failedundeliveredTask')
  const storyId = getState(context).story
  const taskResource = new PtTask(context, storyId, taskTreeItem.itemId)
  let delivery
  try {
    delivery = await taskResource.updateTask({complete: false})    
  } catch (error) {
    return rebounds('failedundeliveredTask')    
  }
  if(delivery.res.statusCode === 200){
    await rebounds('undeliveredTask', context)
    taskTreeItem.dataProvider.refresh()
    return    
  }
  else {
    return rebounds('failedundeliveredTask')
  }
}
