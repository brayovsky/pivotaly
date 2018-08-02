const token = require('./isTokenPresent')
const Common = require('../../../test/factories/command/common')
const common = Common.build()

describe('#isTokenPresent', () => {
  test('test if token is present', () => {
    const context = {
      workspaceState: {
        get: function(){
          return common.globals.APItoken
        }
      }
    }
    expect(token.isTokenPresent(context)).toBeTruthy()
  })
})