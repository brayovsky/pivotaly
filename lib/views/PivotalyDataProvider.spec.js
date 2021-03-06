const PivotalyDataProvider = require('./PivotalyDataProvider')
const Context = require('../../test/factories/vscode/context')
const PtBlocker = require('../../model/blockers')
jest.mock('../../model/blockers')

const context = Context.build()
const PivotalyProvider = new PivotalyDataProvider(context)

describe('#PivotalyDataProvider', () => {
  describe('getTreeItem', () => {
    it('should return the element provided', () => {
      const child = PivotalyProvider.getTreeItem('child')
      expect(child).toBe('child')
    })
  })

  describe('_fetchResource', () => {
    beforeEach(() => PtBlocker.mockClear())

    it('Should instantiate a given class with provided arguments', () => {
      expect(PtBlocker).not.toHaveBeenCalled()
      PivotalyProvider._fetchResource(PtBlocker, 'getBlockers', ['context'], [])
      expect(PtBlocker).toBeCalledTimes(1)
      expect(PtBlocker).toHaveBeenCalledWith('context')
    })

    it('Should call a method of a given class with given arguments', () => {
      PivotalyProvider._fetchResource(PtBlocker, 'getBlockers', [context], ['arg1', 'arg2'])
      const mockGetBlockers = PtBlocker.mock.instances[0].getBlockers
      expect(mockGetBlockers).toBeCalledTimes(1)
      expect(mockGetBlockers).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('Should return data from the method call', async () => {
      PtBlocker.mockImplementationOnce(() => ({
        getBlockers: () => ({
          data: 'allBlockers'
        })
      }))
      const blockers = await PivotalyProvider._fetchResource(PtBlocker, 'getBlockers', [context], ['arg1', 'arg2'])
      expect(blockers).toBe('allBlockers')
    })

    it('Should return an empty array if an error occurs as it fetches data', async () => {
      PtBlocker.mockImplementationOnce(() => ({
        getBlockers: () => {
          throw new Error('Test error')
        }
      }))
      const blockers = await PivotalyProvider._fetchResource(PtBlocker, 'getBlockers', [context], ['arg1', 'arg2'])
      expect(blockers).toHaveLength(0)
    })
  })

  describe('refresh', () => {
    it('Should call raise onChangeTreeData event', () => {
      PivotalyProvider._onDidChangeTreeData.fire = jest.fn()
      PivotalyProvider.refresh()
      expect(PivotalyProvider._onDidChangeTreeData.fire).toHaveBeenCalledTimes(1)
    })
  })

  describe('getChildren', () => {
    it('should by default return an empty array', async () => {
      const children = await PivotalyProvider.getChildren()

      expect(children).toHaveLength(0)
    })
  })

  describe('getters and setters', () => {
    let UNSAFE_PivotalyDataProvider = new PivotalyDataProvider(context)
    const newStory = {
      id: 'newId',
      description: 'New description'
    }

    test('set story should change _story and _storyId properties', () => {
      UNSAFE_PivotalyDataProvider.story = newStory
      
      expect(UNSAFE_PivotalyDataProvider._storyId).toBe(newStory.id)
      expect(UNSAFE_PivotalyDataProvider._story).toMatchObject(newStory)
    })
    test('get story should return story id', () => {
      expect(UNSAFE_PivotalyDataProvider.story).toMatchObject(newStory)
     })
  })
})
