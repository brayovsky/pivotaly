jest.mock('../')
const PtIteration = require('./')
const Model = require('../')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()
const IterationResource = new PtIteration(context, 30)


describe('#iterations', () => {
  describe('_endpoints', () => {
    const modelMockInstance = Model.mock.instances[0]
    modelMockInstance._addParams = jest.fn().mockReturnValue('apiPath?params=7')

    afterEach(() => Model.mockClear())

    test('it should have all iteration endpoints', () => {
      const endpoints = IterationResource._endpoints
      expect(endpoints).toHaveProperty('getIterations')
      expect(endpoints).toHaveProperty('getIterationCycleTime')
      endpoints.getIterations('done')
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
    modelMockInstance._addParams = jest.fn().mockReturnValue('apiPath?params=7')

    afterEach(() => Model.mockClear())

    test('it should raise error if scope is invalid', () => {
      expect(() => IterationResource.getIterations('invalid')).toThrowError('Invalid scope')
    })

    test('it should call fetch with the right params', async () => {
      await IterationResource.getIterations('current')
      expect(modelMockInstance._fetch).toHaveBeenCalledWith('get', 'apiPath?params=7')
    })
  })

  describe('getIterationCycleTime', () => {
    const modelMockInstance = Model.mock.instances[0]
    modelMockInstance._baseApiPath = 'apiPath'

    afterEach(() => Model.mockClear())

    test('it should call fetch with the right params', async () => {
      await IterationResource.getIterationCycleTime(1)
      expect(modelMockInstance._fetch).toHaveBeenCalledWith('get', 'undefined/iterations/1/analytics/cycle_time_details')
    })
  })
})
