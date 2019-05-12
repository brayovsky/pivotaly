jest.mock('../../helpers/state')
jest.mock('../../helpers/git')
const {getState} = require('../../helpers/state')
const {getActiveBranch} = require('../../helpers/git')
const {didBranchChange} = require('./didBranchChange')
const Context = require('../../../test/factories/vscode/context')

const context = Context.build()

describe('#didBrancheChange', () => {
  afterEach(() => jest.clearAllMocks())

  test('it should return true if branch changed', async () => {
    getState.mockImplementationOnce(jest.fn().mockReturnValue({branch: 'one'}))
    getActiveBranch.mockImplementationOnce(jest.fn().mockResolvedValue('two'))
    const didChange = await didBranchChange(context)
    expect(didChange).toBe(true)
  })

  test('it should return true if branch did not change', async () => {
    getState.mockImplementationOnce(jest.fn().mockReturnValue({branch: 'one'}))
    getActiveBranch.mockImplementationOnce(jest.fn().mockResolvedValue('one'))
    const didChange = await didBranchChange(context)
    expect(didChange).toBe(false)
  })
})
