const {window} = require('vscode')
const Task = require('../../model/tasks')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/state')

module.exports = async (taskTreeItem, context) => {
  const description = await window.showInputBox({
    prompt: 'Enter task description'
  })
  if(!description) return
  const storyId = getState(context).story
  const TaskResource = new Task(context, storyId, null)
  let creation
  try{
    creation = await TaskResource.createTask(description)
  } catch (error) {
    return rebounds('failedAddTask')
  }
  if(creation.res.statusCode === 200) {
    await rebounds('addTask', context)
    taskTreeItem.dataProvider.refresh()
    return
  }
  return rebounds('failedAddTask')
}
