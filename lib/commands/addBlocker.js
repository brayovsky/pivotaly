const {window} = require('vscode')
const Blocker = require('../../model/blockers')
const rebounds = require('../validation/rebounds')
const {getState} = require('../helpers/state')

module.exports = async (taskTreeItem, context) => {
  const description = await window.showInputBox({
    prompt: 'Enter blocker description'
  })
  if(!description) return
  const storyId = getState(context).story
  const BlockerResource = new Blocker(context, storyId, null)
  let creation
  try{
    creation = await BlockerResource.createBlocker(description)
  } catch (error) {
    return rebounds('failedAddBlocker')
  }
  if(creation.res.statusCode === 200) {
    await rebounds('addBlocker', context)
    taskTreeItem.dataProvider.refresh()
    return
  }
  return rebounds('failedAddBlocker')
}
