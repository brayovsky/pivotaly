jest.mock('vscode')
const vscode = require("vscode");
const createPTStatusBarItem = require('./createPTStatusBarItem')

describe('#createPTStatusBarItem', () => {
  test('test create status bar item', () => {
    vscode.mockReturnValueOnce({ show(){} } )
    expect(createPTStatusBarItem()).toBe('object')
  })
})