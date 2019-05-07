jest.mock('../../../model/tasks')
jest.mock('../../../model/blockers')
const StoryInfoDataProvider = require('./storyInfoDataProvider')
const Context = require('../../../test/factories/vscode/context')
const PtTasks = require('../../../model/tasks')
const PtBlockers = require('../../../model/blockers')

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
    let getAllTasksMock = jest.fn().mockReturnValue({data: 'data'})
    let getBlockersMock = jest.fn().mockReturnValue({data: 'data'})

    beforeEach(() => {
      PtTasks.mockImplementation(() => ({
        getAllTasks: getAllTasksMock
      }))

      PtBlockers.mockImplementation(() => ({
        getBlockers: getBlockersMock
      }))
      
      StoryInfoProvider._getTreeItemsFromDescriptions = jest.fn((data, type) => [data, type])
    })

    afterEach(() => jest.clearAllMocks())

    it('should return an array of treeitems if no element is provided', async () => {
      const children = StoryInfoProvider.getChildren()
      expect(typeof children).toBe('object')
    })

    it('should get tasks if a tree item label is Tasks', async () => {
      const children = await StoryInfoProvider.getChildren({label: 'Tasks'})
      expect(getAllTasksMock).toHaveBeenCalledTimes(1)
      expect(children[1]).toBe('tasks')
    })

    it('should get blockers if a tree item label is Blockers', async () => {
      const children = await StoryInfoProvider.getChildren({label: 'Blockers'})
      expect(getBlockersMock).toHaveBeenCalledTimes(1)
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
      const descItems = [
        {id: 1, description: 'foo', complete: true},
        {id:2, description: 'bar', complete: false}
      ]
      const items = StoryProvider._getTreeItemsFromDescriptions(descItems, 'label')
      expect(items).toHaveLength(2)
      items.forEach((item, index) => {
        expect(item.label).toBe(descItems[index].description)
      })
    })
  })

  describe('refresh', () => {
    it('should fire onDidChangeTreeData event', () => {
      StoryInfoProvider._onDidChangeTreeData.fire = jest.fn()
      StoryInfoProvider.refresh()
      expect(StoryInfoProvider._onDidChangeTreeData.fire).toHaveBeenCalledTimes(1)
      jest.clearAllMocks()
    })
  })

  describe('_generateContextValue', () => {
    let samples
    beforeAll(() => {
      samples = {
        completeTask: {id: 1, complete: true},
        incompleteTask: {id:2, complete: false},
        resolvedBlocker: {id:3, resolved: true},
        unresolvedBlocker: {id:4, resolved: false}
      }
    })
    describe('for a task', () => {
      it('should return completeTask-<id> if task is complete', () => {
        const contextValue = StoryInfoProvider._generateContextValue(samples.completeTask)
        expect(contextValue).toBe('completeTask-1')
      })

      it('should return incompleteTask-<id> if task is complete', () => {
        const contextValue = StoryInfoProvider._generateContextValue(samples.incompleteTask)
        expect(contextValue).toBe('incompleteTask-2')
      })
    })

    describe('for a blocker', () => {
      it('should return resolvedBlocker-<id> if task is complete', () => {
        const contextValue = StoryInfoProvider._generateContextValue(samples.resolvedBlocker)
        expect(contextValue).toBe('resolvedBlocker-3')
      })

      it('should return unresolvedBlocker-<id> if task is complete', () => {
        const contextValue = StoryInfoProvider._generateContextValue(samples.unresolvedBlocker)
        expect(contextValue).toBe('unresolvedBlocker-4')
      })
    })
  })
})
