jest.mock(('../../../model/projects'))
const PtProject = require('../../../model/projects')
const {isProjectIDValid} = require('./isProjectIDValid')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

describe('#isProjectIDValid', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should return true if project returns', async () => {
    PtProject.mockImplementationOnce(() => ({
      getProject: jest.fn().mockResolvedValue({
        res:{
          statusCode: 200
        }
      })
    }))
    const isValid = await isProjectIDValid(context)
    expect(isValid).toBe(true)
  })

  test('it should return false if project is not found', async () => {
    PtProject.mockImplementationOnce(() => ({
      getProject: jest.fn().mockResolvedValue({
        res:{
          statusCode: 404
        }
      })
    }))
    const isValid = await isProjectIDValid(context)
    expect(isValid).toBe(false)
  })

  test('it should return false if authentication fails', async () => {
    PtProject.mockImplementationOnce(() => ({
      getProject: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    const isValid = await isProjectIDValid(context)
    expect(isValid).toBe(false)
  })
})
