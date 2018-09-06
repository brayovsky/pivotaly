jest.mock('../../../model')
const cycleTimeDataProvider = require('./cycleTimeDataProvider')
const {model} = require('../../../model')
const {TreeItem} = require('vscode')
const {commands} = require('../../commands')

const portal = {
  2018: {
    January: [{
      label: '20th - 23rd',
      iterationNumber: 25
    }]
  }
}

describe('#cycleTimeDataProvider', () => {
  afterAll(() => jest.clearAllMocks())

  it('should implement getChildren', () => {
    const provider = new cycleTimeDataProvider({})
    expect(typeof provider.getChildren).toBe('function')
  })

  it('should implement getTreeITem', () => {
    const provider = new cycleTimeDataProvider({})
    expect(typeof provider.getTreeItem).toBe('function')
  })

  describe('getChildren', () => {
    let provider
    beforeEach(() => {
      provider = new cycleTimeDataProvider({})
      provider._portal = portal
    })

    it('should get get years if no element is passed', async () => {
      model.getIterations.mockReturnValue({data: []})
      provider._createIterationPortal = jest.fn()
      const items = await provider.getChildren()
      expect(typeof items).toBe('object')
      expect(items.length).toBe(1)
      expect(items[0].label).toBe('2018')
    })

    it('should get months if a year is provided as an element', async () => {
      const year = new TreeItem('2018')
      const items = await provider.getChildren(year)
      expect(typeof items).toBe('object')
      expect(items.length).toBe(1)
      expect(items[0].label).toBe('January')
    })

    it('should get iterations if month is passed', async () => {
      const month = new TreeItem('January')
      month.year = 2018
      const items = await provider.getChildren(month)
      expect(typeof items).toBe('object')
      expect(items.length).toBe(1)
      expect(items[0].label).toBe('20th - 23rd')
    })
  })

  describe('getTreeItem', () => {
    it('should return the element passed to it', () => {
      const item = new cycleTimeDataProvider({}).getTreeItem(4)
      expect(item).toBe(4)
    })
  })

  describe('_getIterations', async () => {
    it('should get itreations from the model', async () => {
      model.getIterations = jest.fn().mockReturnValue({data: []})
      const provider = new cycleTimeDataProvider()
      await provider._getIterations()
      expect(model.getIterations.mock.calls.length).toBe(1)
    })

    it('should use done_current scope', async () => {
      model.getIterations = jest.fn().mockReturnValue({data: []})
      const provider = new cycleTimeDataProvider('context')
      await provider._getIterations()
      expect(model.getIterations.mock.calls[0][0]).toBe('context')
      expect(model.getIterations.mock.calls[0][1]).toBe('done_current')
    })
  })

  describe('_getYears', () => {
    let provider

    beforeEach(() => {
      provider = new cycleTimeDataProvider({})
      provider._portal = portal
    })

    it('should get top level keys', () => {
      const years = provider._getYears()
      expect(years).toHaveLength(1)
      expect(years[0].label).toBe('2018')
    })
  })

  describe('_getMonths', () => {
    let provider

    beforeEach(() => {
      provider = new cycleTimeDataProvider({})
      provider._portal = portal
    })

    it('should get second level keys', () => {
      const months = provider._getMonths('2018')
      expect(months).toHaveLength(1)
      expect(months[0].label).toBe('January')
    })

    it('should return an object with a year property', () => {
      const months = provider._getMonths('2018')
      expect(months[0].year).toBe('2018')
    })
  })

  describe('_getTreeIterations', () => {
    let provider

    beforeEach(() => {
      provider = new cycleTimeDataProvider('context')
      provider._portal = portal
    })

    it('should get iterations', () => {
      const item = provider._getTreeIterations('2018', 'January')
      expect(item).toHaveLength(1)
      expect(item[0].label).toBe('20th - 23rd')
    })

    it('should pass in the right command', () => {
      const item = provider._getTreeIterations('2018', 'January')
      expect(item[0].command.title).toBe('View Stats')
      expect(item[0].command.command).toBe(commands.statistics.cycleTime)
      expect(item[0].command.arguments).toHaveLength(3)
      expect(item[0].command.arguments[0]).toBe('context')
      expect(item[0].command.arguments[1]).toBe(provider._scope)
      expect(item[0].command.arguments[2]).toBe(25)
      expect(item[0].tooltip).toBe('View iteration stats')
    })
  })

  describe('_createIterationPortal', () => {
    const iterations = [
      {
        start: '2018-08-14T12:01:00Z',
        finish: '2018-08-21T12:01:00Z',
        number: 2,
      },
      {
        start: '2017-07-14T12:01:00Z',
        finish: '2017-07-21T12:01:00Z',
        number: 2,
      },
      {
        start: '2017-08-14T12:01:00Z',
        finish: '2017-08-21T12:01:00Z',
        number: 2,
      }
    ]

    it('should create a portal object given iterations', () => {
      const provider = new cycleTimeDataProvider('context')
      provider._createIterationPortal(iterations)
      expect(provider._portal).toHaveProperty('2018')
      expect(provider._portal).toHaveProperty('2017')
      expect(provider._portal[2018]).toHaveProperty('August')
      expect(provider._portal[2017]).toHaveProperty('August')
      expect(provider._portal[2017]).toHaveProperty('July')
      expect(provider._portal[2018].August).toHaveLength(1)
      expect(provider._portal[2018].August[0].label).toBe('14-Aug-2018 to 21-Aug-2018')
    })
  })
})
