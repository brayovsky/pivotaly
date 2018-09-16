const StoryInfoDataProvider = require('./storyInfoDataProvider')
const Context = require('../../test/factories/vscode/context')
const {model} = require('../../model')

const context = Context.build()
const StoryInfoProvider = new StoryInfoDataProvider(context)
describe('#StoryInfoDataProvider', () => {
  describe('_getTreeItem', () => {
    it('should return the element provided', () => {
      const child = StoryInfoProvider.getTreeItem('child')
      expect(child).toBe('child')
    })
  })

  describe('getChildren', () => {
    beforeEach(() => {
      model.getAllTasks = jest.fn().mockReturnValue({data: 'data'})
      model.getBlockers = jest.fn().mockReturnValue({data: 'data'})
      StoryInfoProvider._getTreeItemsFromDescriptions = jest.fn((data, type) => [data, type])
    })

    afterEach(() => jest.clearAllMocks())

    it('should return an array of treeitems if no element is provided', async () => {
      const children = StoryInfoProvider.getChildren()
      expect(typeof children).toBe('object')
    })

    it('should get tasks if a tree item label is Tasks', async () => {
      const children = await StoryInfoProvider.getChildren({label: 'Tasks'})
      expect(model.getAllTasks.mock.calls).toHaveLength(1)
      expect(children[1]).toBe('tasks')
    })

    it('should get blockers if a tree item label is Blockers', async () => {
      const children = await StoryInfoProvider.getChildren({label: 'Blockers'})
      expect(model.getBlockers.mock.calls).toHaveLength(1)
      expect(children[1]).toBe('blockers')
    })
  })

  describe('_getTreeItemsFromDescriptions', () => {
    let StoryProvider
    beforeAll(() => StoryProvider = new StoryInfoDataProvider(context))

    it('should return a treeitem with error label if supplied array is empty', () => {
      const items = StoryProvider._getTreeItemsFromDescriptions([], 'label')
      expect(items).toHaveLength(1)
      expect(items[0].label).toBe('No label yet')
    })

    it('should return a tree item array with description as label of provided items', () => {
      const descItems = [{description: 'foo'}, {description: 'bar'}]
      const items = StoryProvider._getTreeItemsFromDescriptions(descItems, 'label')
      expect(items).toHaveLength(2)
      items.forEach((item, index) => {
        expect(item.label).toBe(descItems[index].description)
      })
    })
  })
})
