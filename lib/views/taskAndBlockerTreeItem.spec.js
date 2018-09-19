const TaskAndBlockerTreeItem = require('./taskAndBlockerTreeItem')
const StoryInfoDataProvider = require('./storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()
const StoryInfoProvider = new StoryInfoDataProvider(context)
const TaskTreeItem = new TaskAndBlockerTreeItem('My task', StoryInfoProvider)

describe('#taskAndBlockerTreeItem', () => {
  it('should set itemid and context value when taskOrBlockerContext is set', () => {
    TaskTreeItem.taskOrBlockerContext = 'complete-1'
    expect(TaskTreeItem.contextValue).toBe('complete')
    expect(TaskTreeItem.itemId).toBe('1')
  })

  it('should get taskOrBlockerContext as was set', () => {
    expect(TaskTreeItem.taskOrBlockerContext).toBe('complete-1')
  })
})
