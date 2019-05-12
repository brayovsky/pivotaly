jest.mock('../../../model/projects')
const {isTokenValid} = require('./isTokenValid')
const PtProjects = require('../../../model/projects')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

describe('#isTokenValid', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should return true if projects can be fetched successfully', async () => {
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        res: {
          statusCode: 200
        }
      })
    }))
    const isValid = await isTokenValid(context)
    expect(isValid).toBe(true)
  })

  test('it should return true if projects cannot be fetched successfully but authentication succeeded', async () => {
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockResolvedValue({
        res: {
          statusCode: 404
        }
      })
    }))
    const isValid = await isTokenValid(context)
    expect(isValid).toBe(true)
  })

  test('it should return false if authentication failed', async () => {
    PtProjects.mockImplementationOnce(() => ({
      getAllProjects: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    const isValid = await isTokenValid(context, 1)
    expect(isValid).toBe(false)
  })
})
