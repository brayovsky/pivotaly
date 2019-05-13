jest.mock('../../../model/iterations')
const moment = require('moment')
const cycleTimeDataProvider = require('./cycleTimeDataProvider')
const PtIterations = require('../../../model/iterations')
const {TreeItem} = require('vscode')
const {commands} = require('../../commands')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

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

  afterEach(() => PtIterations.mockClear())

  describe('getChildren', () => {
    let provider
    beforeEach(() => {
      provider = new cycleTimeDataProvider(context, {length: 20, unit: 'years'})
      provider._createIterationPortal = jest.fn()
      provider._portal = portal
    })

    it('should get get years if no element is passed', async () => {
      PtIterations.mockImplementation(jest.fn().mockReturnValue({
        getIterations: () => ({data: []})
      }))
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
      const item = new cycleTimeDataProvider(context, {length: 20, unit: 'years'}).getTreeItem(4)
      expect(item).toBe(4)
    })
  })

  describe('_getIterations', async () => {
    let getIterationsMock = jest.fn().mockResolvedValue({data: []})

    beforeEach(() => {
      PtIterations.mockImplementation(jest.fn().mockReturnValue({
        getIterations: getIterationsMock
      }))
    })

    afterEach(() => PtIterations.mockClear())

    it('should get iterations from the model', async () => {
      const provider = new cycleTimeDataProvider(context, {length: 20, unit: 'years'})
      await provider._getIterations()
      expect(getIterationsMock).toHaveBeenCalledTimes(1)
    })

    it('should use done_current scope', async () => {
      const provider = new cycleTimeDataProvider(context, {length: 20, unit: 'years'})
      await provider._getIterations()
      expect(getIterationsMock.mock.calls[0][0]).toBe('done_current')
    })

    it('should return null if authentication fails', async () => {
      PtIterations.mockClear()
      PtIterations.mockImplementationOnce(jest.fn().mockReturnValue({
        getIterations: jest.fn().mockRejectedValueOnce('invalid_authentication')
      }))
      const provider = new cycleTimeDataProvider(context, {length: 20, unit: 'years'})
      const iterations = await provider._getIterations()
      expect(iterations).toBe(null)
    })
  })

  describe('_getYears', () => {
    let provider

    beforeEach(() => {
      provider = new cycleTimeDataProvider(context, {length: 20, unit: 'years'})
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
      provider = new cycleTimeDataProvider(context, {length: 20, unit: 'years'})
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
      provider = new cycleTimeDataProvider(context, {length: 20, unit: 'years'})
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
      expect(context).toMatchObject(item[0].command.arguments[0])
      expect(item[0].command.arguments[1]).toBe(provider._scope)
      expect(item[0].command.arguments[2]).toBe(25)
      expect(item[0].tooltip).toBe('View iteration stats')
    })
  })

  describe('_createIterationPortal', () => {
    const now = moment()
    const iterations = [
      {
        start: now.utc().format(),
        finish: now.clone().add(1, 'weeks').utc().format(),
        number: 2,
      },
      {
        start: now.clone().subtract(1, 'years').utc().format(),
        finish: now.clone().subtract(1, 'years').add(1, 'weeks').utc().format(),
        number: 2,
      },
      {
        start: now.clone().subtract(1, 'years').add(1, 'months').utc().format(),
        finish: now.clone().subtract(1, 'years').add(1, 'months').add(1, 'weeks').utc().format(),
        number: 2,
      }
    ]

    const thisYear = now.format('YYYY'), 
    lastYear = now.clone().subtract(1, 'years').format('YYYY'),
    thisMonth = now.format('MMMM'),
    thisMonthLastYear = now.clone().subtract(1, 'years').format('MMMM'),
    yearOfDynamicCase = now.clone().subtract(1, 'years').add(1, 'months').utc().format('YYYY'),
    monthOfDynamicCase = now.clone().subtract(1, 'years').add(1, 'months').utc().format('MMMM')

    it('should create a portal object given iterations', () => {
      const provider = new cycleTimeDataProvider(context, {length: 2, unit: 'years'})
      provider._createIterationPortal(iterations)
      expect(provider._portal).toHaveProperty(thisYear) // this year
      expect(provider._portal).toHaveProperty(lastYear) // last year
      expect(provider._portal[thisYear]).toHaveProperty(thisMonth)
      expect(provider._portal[lastYear]).toHaveProperty(thisMonthLastYear)
      expect(provider._portal[yearOfDynamicCase]).toHaveProperty(monthOfDynamicCase)
      expect(provider._portal[thisYear][thisMonth]).toHaveLength(1)
      const itStart = now.clone(), itFinish = now.clone().add(1, 'weeks')
      expect(provider._portal[thisYear][thisMonth][0].label).toBe(`${itStart.format('D-MMM-YYYY')} to ${itFinish.format('D-MMM-YYYY')}`)
    })
  })
})
