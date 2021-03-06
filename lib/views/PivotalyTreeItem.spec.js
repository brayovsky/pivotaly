const TaskAndBlockerTreeItem = require('./PivotalyTreeItem')
const StoryInfoDataProvider = require('./storyInfo/storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()
const StoryInfoProvider = new StoryInfoDataProvider(context)
const TaskTreeItem = new TaskAndBlockerTreeItem('My task', StoryInfoProvider, 'item-1')

describe('#taskAndBlockerTreeItem', () => {
  it('should set itemid and context value when taskOrBlockerContext is set', () => {
    expect(TaskTreeItem.contextValue).toBe('item')
    expect(TaskTreeItem.itemId).toBe('1')
  })

  it('should get taskOrBlockerContext as was set', () => {
    expect(TaskTreeItem.contextString).toBe('item-1')
  })

  it('should have the dataprovider\'s story as its associated story', () => {
    expect(TaskTreeItem.associatedStory.id).toEqual(StoryInfoProvider.story.id)
  })

  describe('toString', () => {
    it('should return the itemid', () => {
      expect(TaskTreeItem.toString()).toBe('1')
    })
  })

  describe('refresh', () => {
    test('should refersh dataProvider', () => {
      StoryInfoProvider.refresh = jest.fn();
      TaskTreeItem.refresh()
      expect(StoryInfoProvider.refresh).toBeCalledTimes(1)
    })
  })
})
