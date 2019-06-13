jest.mock('../index')
const Model = require('../index')
const Blocker = require('./index')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

const PtBlocker = new Blocker(context, 1, 2)

describe('#blockers', () => {
  describe('getBlockers', () => {
    test('should fetch using getBlockers endpoint', () => {
      PtBlocker.getBlockers()
      expect(Model.mock.instances[0]._fetch).toBeCalledWith('get', PtBlocker._blockerEndpoints.getBlockers)
    })
  })

  describe('updateBlocker', () => {
    test('should update using updateBlockers endpoint', () => {
      PtBlocker.updateBlocker({resolved: true})
      expect(Model.mock.instances[0]._update).toBeCalledWith('put', PtBlocker._blockerEndpoints.updateBlocker, {resolved: true})
    })
  })

  describe('createBlocker', () => {
    test('should update using createBlocker endpoint', () => {
      const description = 'new blocker'
      PtBlocker.createBlocker(description)
      expect(Model.mock.instances[0]._update).toBeCalledWith('post', PtBlocker._blockerEndpoints.createBlocker, {
        description,
        story_id: 1,
        project_id: PtBlocker._projectId
      })
    })
  })
})
