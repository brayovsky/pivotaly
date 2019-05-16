jest.mock('../../model/accounts')
jest.mock('../../model/iterations')
const vscode = require('vscode')
const PtAccount = require('../../model/accounts')
const PtIteration = require('../../model/iterations')
const showStats = require('./showStats')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

describe('#showStats', () => {
  test('it should fail if authentication fails and show error message', async () => {
    vscode.window.showErrorMessage = jest.fn().mockResolvedValue('failed')
    PtAccount.mockImplementationOnce(jest.fn().mockReturnValue({
      getMemberships: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    PtIteration.mockImplementationOnce(jest.fn().mockReturnValue({
      getIterations: jest.fn().mockRejectedValue('invalid_authentication'),
      getIterationCycleTime: jest.fn().mockRejectedValue('invalid_authentication')
    }))
    const stats = await showStats(context)
    expect(stats).toBe('failed')
  })
})
