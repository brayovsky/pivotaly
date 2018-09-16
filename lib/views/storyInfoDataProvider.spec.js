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
    beforeAll(() => {
      model.getAllTasks = jest.fn().mockReturnValue({data: 'data'})
      model.getBlockers = jest.fn().mockReturnValue({data: 'data'})
      StoryInfoProvider._getTreeItemsFromDescriptions = jest.fn((data, type) => [data, type])
    })

    afterAll(() => jest.clearAllMocks())

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
})
