const propertyToKey = require('./propertyToKey')

describe('#propertyToKey', () => {
  it('should create an object with the provided property as the key', () => {
    const data = [{eyes: 2, legs: 4}]
    const dataByLegs = propertyToKey(data, 'legs')
    expect(dataByLegs).toMatchObject({
      4: {
        eyes: 2,
        legs: 4
      }
    })
  })
})
