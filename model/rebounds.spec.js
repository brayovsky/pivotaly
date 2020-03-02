const vscode = require('vscode')
const rebounds = require('./rebounds')
const {commands} = require('../lib/commands/commands')

describe('#rebounds', () => {
  describe('invalid_parameter', async () => {
    const err = {
      restCode: 'invalid_parameter'
    }

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('Should redo action if there was an estimate error', async () => {
      const error = { ...err, body: {
        validation_errors: [{field: 'estimate'}]
      }}
      const shouldRedo = await rebounds(error)
      expect(shouldRedo).toBe(true)
    })

    it('Should not redo action if there was no estimate error', async () => {
      const error = { ...err, body: {
        validation_errors: []
      }}
      const shouldRedo = await rebounds(error)
      expect(shouldRedo).toBe(false)
    })
    
    it('Should redo execute estimate story command if there was an estimate error', async () => {
      const error = { ...err, body: {
        validation_errors: [{field: 'estimate'}]
      }}
      await rebounds(error)
      expect(vscode.commands.executeCommand).toBeCalledTimes(1)
      expect(vscode.commands.executeCommand).toBeCalledWith(commands.storyState.estimateStory)
    })
  })
})
