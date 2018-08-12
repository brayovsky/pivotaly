const {createPTStatusBarItem} = require('./createPTStatusBarItem')

describe('#createPTStatusBarItem', () => {
  test('test create status bar object', () => {
    expect(typeof createPTStatusBarItem()).toBe('object')
  })
  test('should return status bar with command and test', () => {
    const statusBar = createPTStatusBarItem()
    expect(statusBar.command).toEqual('pivotaly.showCommandQuickPick')
    expect(statusBar.text).toEqual('Pivotaly')
  })
})