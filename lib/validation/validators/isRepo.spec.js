const isRepo = require('./isRepo')

describe('#isRepo', async () => {
  it('should resolve to false if an error occurs', async () => {
    const isARepo = await isRepo('rootPath')
    expect(isARepo).toBe(false)
  })
})
