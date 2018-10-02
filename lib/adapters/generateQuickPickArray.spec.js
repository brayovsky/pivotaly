const {generateQuickPickArray, extractIdFromQuickPick} = require('./generateQuickPickArray')

describe('#generateQuickPickArray', () => {
  it('should create new array with name and id', () => {
    const data = [
      {
        id: 2,
        name: 'Toyota'
      },
      {
        id: 7,
        name: 'Honda',
        color: 'blue'
      }
    ]
    const quickPickElements = generateQuickPickArray(data)
    expect(quickPickElements).toHaveLength(2)
    expect(quickPickElements[0]).toBe('Toyota - 2')
    expect(quickPickElements[1]).toBe('Honda - 7')
  })
})

describe('#extractIdFromQuickPick', () => {
  it('should get the id given a string with an appended id', () => {
    const display = 'Toyota - 2'
    const id = extractIdFromQuickPick(display)
    expect(id).toBe('2')
  })
})
