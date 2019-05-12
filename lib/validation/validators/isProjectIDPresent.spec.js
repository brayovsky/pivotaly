const {isProjectIDPresent} = require('./isProjectIDPresent')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

describe('#isProjectIDPresent', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should return false if project id is not present', async () => {
    context.workspaceState.get = jest.fn().mockReturnValue(null)
    const isPresent = await isProjectIDPresent(context)
    expect(isPresent).toBe(false)
  })

  test('it should return true if project id is present', async () => {
    context.workspaceState.get = jest.fn().mockReturnValue('2345')
    const isPresent = await isProjectIDPresent(context)
    expect(isPresent).toBe(true)
  })
})
