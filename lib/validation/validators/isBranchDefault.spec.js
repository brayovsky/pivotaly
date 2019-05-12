jest.mock('../../helpers/git')
const vscode = require('vscode')
const {isBranchDefault} = require('./isBranchDefault')
const {getActiveBranch} = require('../../helpers/git')


describe('#isBranchDefault', () => {
  beforeEach(() => vscode.workspace.getConfiguration = jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue(['master', 'develop'])
  }))

  afterEach(() => jest.clearAllMocks())

  test('it should return false if branch is included as a default branch in configuration', async () => {
    getActiveBranch.mockImplementationOnce(jest.fn().mockReturnValue('master'))
    const isDefault = await isBranchDefault()
    expect(isDefault).toBe(false)
  })

  test('it should return true if branch is not included as a default branch in configuration', async () => {
    getActiveBranch.mockImplementationOnce(jest.fn().mockReturnValue('ft-other'))
    const isDefault = await isBranchDefault()
    expect(isDefault).toBe(true)
  })
})
