const {TreeItem} = require('vscode')
const CurrentandBacklogDataProvider = require('./currentandBacklogDataProvider')
const PivotalyDataProvider = require('../PivotalyDataProvider')
const PivotalTreeItem = require('../PivotalyTreeItem')
const PtIterations = require('../../../model/iterations')
const Context = require('../../../test/factories/vscode/context')
jest.mock('../../../model/iterations')

const context = Context.build()
const PivotalProvider = new PivotalyDataProvider(context)
const BacklogProvider = new CurrentandBacklogDataProvider(context, PivotalProvider)

describe("#currentandBacklogDataProvider", () => {
  describe('getChildren', () => {
    PivotalProvider.getChildren = jest.fn().mockResolvedValue([])

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('Should return an  array of all stories from current and backlog iterations', async () => {
      PtIterations.mockImplementationOnce(() => ({
        getIterations: () => ({
          data: [
            {
                "number": 2,
                "stories":
                [
                    {
                        "name": "Story 1",
                        "project_id": 99,
                    },
                    {
                        "name": "Story 2",
                        "project_id": 99,
                    }
                ]
            },
            {
                "number": 3,
                "stories":
                [
                  {
                    "name": "Story 3",
                    "project_id": 99,
                }
                ],
                "start": "2020-02-11T12:00:10Z",
                "finish": "2020-02-11T12:00:15Z",
                "kind": "iteration"
            },
            {
                "number": 4,
                "stories":
                [
                ],
                "start": "2020-02-11T12:00:15Z",
                "finish": "2020-02-11T12:00:20Z",
                "kind": "iteration"
            }
         ]
        })
      }))
      const children = await BacklogProvider.getChildren()
      expect(children).toHaveLength(3)
    })

    it('Should return a single TreeItem if no iterations exist', async () => {
      PtIterations.mockImplementationOnce(() => ({
        getIterations: () => ({
          data: []
        })
      }))
      const children = await BacklogProvider.getChildren()
      expect(children).toBeInstanceOf(TreeItem)
      expect(children.label).toBe('No Story Available')
    })

    it('should set story to associatedStory if element is a TreeItem', async () => {
      const element = new PivotalTreeItem('my element', PivotalProvider, 'element-123')
      await BacklogProvider.getChildren(element)

      expect(BacklogProvider.storyInfoProvider.story).toMatchObject(element.associatedStory)
      expect(BacklogProvider.storyInfoProvider.getChildren).toBeCalledTimes(1)
      expect(BacklogProvider.storyInfoProvider.getChildren).toBeCalledWith(element)
    })

    it('should set story to element if element is not a TreeItem', async () => {
      const element = {
        id: 'someId',
        description: 'a description'
      }
      await BacklogProvider.getChildren(element)

      expect(BacklogProvider.storyInfoProvider.story).toMatchObject(element)
      expect(BacklogProvider.storyInfoProvider.getChildren).toBeCalledTimes(1)
      expect(BacklogProvider.storyInfoProvider.getChildren).toBeCalledWith()
    })

    it('should return storyInfoProvider\'s children if element is provided', async () => {
      BacklogProvider.storyInfoProvider.getChildren = jest.fn().mockResolvedValue('children')
      const children = await BacklogProvider.getChildren({})

      expect(children).toEqual('children')
    })
  })

  describe('getTreeItem', () => {
    it('Should return a TreeItem with the story name as the label', () => {
      const treeItem = BacklogProvider.getTreeItem({name: 'Story1', id: 34})
      expect(treeItem).toBeInstanceOf(TreeItem)
      expect(treeItem.label).toBe('Story1')
    })

    it('Should skip item if the item is the current story', () => {
      BacklogProvider._storyId = 'current'
      const treeItem = BacklogProvider.getTreeItem({name: 'Story1', id: 'current'})
      expect(treeItem).toBeNull()
    })

    it('Should skip item if the story_type is a release', () => {
      const treeItem = BacklogProvider.getTreeItem({name: 'Story', id: 123, story_type: 'release'})
      expect(treeItem).toBeNull()
    })
  })
})
