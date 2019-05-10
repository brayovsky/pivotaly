jest.mock('../helpers/git')
jest.mock('../helpers/state')
jest.mock('../validation/validate')
jest.mock('../validation/rebounds')
jest.mock('../../model/iterations')

const vscode = require('vscode')
const rebounds = require('../validation/rebounds')
const {getActiveBranch} = require('../helpers/git')
const {linkStory} = require('./linkStory')
const {validate} = require('../validation/validate')
const Context = require('../../test/factories/vscode/context')
const PtIterations = require('../../model/iterations')

const context = Context.build()

describe('#linkStory', () => {
  beforeEach(() => {
    PtIterations.mockImplementation(() => ({
      getIterations: () => ({
        data: [
                {stories: [{id: 2, name: 'do chore'}]},
                {stories: [{id: 3, name: 'do feature'}]}
        ]
      })
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should rebound linkedStory if successfully linked story', async () => {
    validate.mockReturnValue(true)
    jest.mock('vscode')
    vscode.window.showQuickPick = jest.fn().mockResolvedValue('do chore - 2')
    getActiveBranch.mockReturnValue('activeBranch')
    await linkStory(context)
    expect(rebounds.mock.calls[0][0]).toBe('linkedStory')
  })

  it('should rebound failedLinkedStory if default branch', async () => {
    const _context = Context.build()
    _context.workspaceState.get = jest.fn(() => true)
    validate.mockReturnValue(false)
    await linkStory(_context)
    expect(rebounds.mock.calls[0][0]).toBe('failedLinkedStory')
  })

  it('should return void if no story id is entered', async () => {
    jest.mock('vscode')
    vscode.window.showQuickPick = jest.fn(() => undefined)
    const linkedStory = await linkStory(context)
    expect(linkedStory).toBeUndefined()
  })
})
