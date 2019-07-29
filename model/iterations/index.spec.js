jest.mock('../')
const PtIteration = require('./')
const Model = require('../')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()
const IterationResource = new PtIteration(context)


describe('#iterations', () => {
  describe('_endpoints', () => {
    const modelMockInstance = Model.mock.instances[0]
    modelMockInstance._addParams.mockReturnValue('apiPath?params=7')

    afterEach(() => Model.mockClear())

    test('it should have all iteration endpoints', () => {
      const endpoints = IterationResource._endpoints
      expect(endpoints).toHaveProperty('getIterations')
      expect(endpoints).toHaveProperty('getDoneIterations')
      expect(endpoints).toHaveProperty('getIterationCycleTime')
      endpoints.getIterations({scope: 'current', limit: 10})
      expect(modelMockInstance._addParams).toHaveBeenCalledTimes(1)
      expect({
        scope: 'current',
        limit: 10
      }).toMatchObject(modelMockInstance._addParams.mock.calls[0][1]);

      modelMockInstance._addParams.mockClear()

      endpoints.getDoneIterations('done', 30)
      expect(modelMockInstance._addParams).toHaveBeenCalledTimes(1)
      expect(modelMockInstance._addParams.mock.calls[0][0]).toEqual(IterationResource._baseIterationsPath);
      expect({
        scope: 'done',
        offset: -30,
        limit: 31
      }).toMatchObject(modelMockInstance._addParams.mock.calls[0][1]);
      const cyclePath = endpoints.getIterationCycleTime(1)
      expect(cyclePath).toBe(`${IterationResource._baseIterationsPath}/1/analytics/cycle_time_details`)
    })
  })

  describe('getIterations', () => {
    const modelMockInstance = Model.mock.instances[0]
    modelMockInstance._addParams.mockReturnValue('apiPath?params=7')
    const mockData = {data:[{stories: [{name: 'story 1', id: 1}]}]}
    modelMockInstance._fetch.mockImplementation(() => mockData)

    afterEach(() => Model.mockClear())

    test('it should raise error if scope is invalid', async () => {
      await expect(IterationResource.getIterations({scope: 'done'})).rejects.toThrowError('Invalid scope')
    })

    test('it should call fetch with the right params', async () => {
      await IterationResource.getIterations('current')
      expect(modelMockInstance._fetch).toHaveBeenCalledWith('get', 'apiPath?params=7')
    })

    it('should not compress data if compress is false', async () => {
      const iterations = await IterationResource.getIterations('current', false)
      expect(iterations).toMatchObject(mockData)
    })

    it('should compress data if compress is true', async () => {
      const iterations = await IterationResource.getIterations('current', true)
      expect(iterations).toMatchObject([`${mockData.data[0].stories[0].name} - ${mockData.data[0].stories[0].id}`])
    })
  })

  describe('getDoneIterations', () => {
    const modelMockInstance = Model.mock.instances[0]
    modelMockInstance._addParams.mockReturnValue('apiPath?params=7')

    const mockData = {data:[{stories: [{name: 'story 1', id: 1}]}]}
    modelMockInstance._fetch.mockImplementation(() => mockData)

    afterEach(() => Model.mockClear())

    test('it should raise error if scope is invalid', async () => {
      await expect(IterationResource.getDoneIterations('invalid')).rejects.toThrowError('Invalid scope')
    })

    test('it should call fetch with the right params', async () => {
      await IterationResource.getDoneIterations('done')
      expect(modelMockInstance._fetch).toHaveBeenCalledWith('get', 'apiPath?params=7')
    })

    
    it('should not compress data if compress is false', async () => {
      const iterations = await IterationResource.getDoneIterations('done', 1000, false)
      expect(iterations).toMatchObject(mockData)
    })

    it('should compress data if compress is true', async () => {
      const iterations = await IterationResource.getDoneIterations('done', 1000, true)
      expect(iterations).toMatchObject([`${mockData.data[0].stories[0].name} - ${mockData.data[0].stories[0].id}`])
    })

    test('it should call getIterations if scope does not include done', () => {
      IterationResource.getIterations = jest.fn()
      IterationResource.getDoneIterations('current')
      expect(IterationResource.getIterations).toHaveBeenCalledTimes(1)
    })
  })

  describe('getIterationCycleTime', () => {
    const modelMockInstance = Model.mock.instances[0]

    afterEach(() => Model.mockClear())

    test('it should call fetch with the right params', async () => {
      await IterationResource.getIterationCycleTime(1)
      expect(modelMockInstance._fetch).toHaveBeenCalledWith('get', 'undefined/iterations/1/analytics/cycle_time_details')
    })
  })

  describe('compressIterations', () => {
    it('should return iteration story name and id', () => {
      const compressedIterations = PtIteration.compressIterations([
        {
          stories:[
            {
              name: 'Finish social login',
              id: 5,
              state: 'started'
            },
            {
              name: 'Edit article',
              id: 6,
              state: 'unstarted'
            }
          ]
        },
        {
          stories: [
            {
              name: 'Create article',
              id: 9,
              state: 'finished'
            }
          ]
        }
      ])
      expect(compressedIterations).toMatchObject(['Finish social login - 5', 'Edit article - 6', 'Create article - 9'])
    })
  })
})
