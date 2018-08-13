const {getActiveBranch} = require('./git')

describe('#getActiveBranch', () => {
  test('get active branch', async () => {
    getActiveBranch().then(result => {
        expect(result).toBeTruthy()
      }
    )
  })
})