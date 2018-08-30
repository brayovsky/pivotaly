const memberIdToKey = require('./memberIdToKey')

let members

describe('#memberIdToKey', () => {
  beforeEach(() => {
    members = [
      {
        id: 3,
        person: {
          id: 4
        }
      },
      {
        id: 6,
        person: {
          id: 5
        }
      }
    ]
  })

  it('should create an object with person ids as the keys', () => {
    const membersById = memberIdToKey(members)
    expect(membersById).toHaveProperty('4')
    expect(membersById).toHaveProperty('5')
    expect(membersById[4]).toHaveProperty('id', 3)
    expect(membersById[5]).toHaveProperty('id', 6)
  })
})
