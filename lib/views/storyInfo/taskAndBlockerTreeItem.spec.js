const TaskAndBlockerTreeItem = require('./taskAndBlockerTreeItem')
const StoryInfoDataProvider = require('./storyInfoDataProvider')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()
const StoryInfoProvider = new StoryInfoDataProvider(context)
const TaskTreeItem = new TaskAndBlockerTreeItem('My task', StoryInfoProvider, 'item-1')

describe('#taskAndBlockerTreeItem', () => {
  it('should set itemid and context value when taskOrBlockerContext is set', () => {
    expect(TaskTreeItem.contextValue).toBe('item')
    expect(TaskTreeItem.itemId).toBe('1')
  })

  it('should get taskOrBlockerContext as was set', () => {
    expect(TaskTreeItem.taskOrBlockerContext).toBe('item-1')
  })
})
