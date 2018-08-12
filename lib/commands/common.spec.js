const { common } = require('./common')

describe('#common', () => {
  test('common global tokens', () => {
    expect(common.globals.APItoken).toEqual('pivotaly.APItoken')
    expect(common.globals.projectID).toEqual('pivotaly.projectID')
    expect(common.globals.state).toEqual('pivotaly.state')
  })
})