const refreshMemberCycleView = require('./refreshMemberCycleView')

describe('3refreshMemberCycleView', () => {
  test('calls refresh on data provider', () => {
    const dataProvider = {
      refresh: jest.fn()
    }
    refreshMemberCycleView(dataProvider)
    expect(dataProvider.refresh).toBeCalledTimes(1)
  })
})
