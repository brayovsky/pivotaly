const iterationPortalItem = require('./iterationPortalItem')

const iteration = {
  start: '2017-08-14T12:01:00Z',
  finish: '2017-08-21T12:01:00Z',
  number: 25
}
const portalItem = new iterationPortalItem(iteration)

describe('#iterationPortalItem', () => {
  describe('properties', () => {
    describe('year', () => {
      it('should return year', () => {
        const year = portalItem.year
        expect(year).toBe('2017')
      })
    })

    describe('month', () => {
      it('should return month', () => {
        const month = portalItem.month
        expect(month).toBe('August')
      })
    })

    describe('iterationNumber', () => {
      it('should return iteration number', () => {
        const number = portalItem.iterationNumber
        expect(number).toBe(25)
      })
    })

    describe('label', () => {
      it('should be label from start to finish', () => {
        const label = portalItem.label
        expect(label).toBe('14-Aug-2017 to 21-Aug-2017')
      })
    })

    describe('iteration', () => {
      it('should be the actual iteration object', () => {
        const sIteration = portalItem.iteration
        expect(iteration).toMatchObject(sIteration)
      })
    })
  })
  

  
})
