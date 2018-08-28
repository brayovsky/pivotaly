const mapStoryToMember = require('./mapStoryToMember')

let members, stories

describe('#mapStoryToMember', () => {
  beforeEach(() => {
    members = {
      1: {iteration_stories: []},
      2: {iteration_stories: []},
      3: {iteration_stories: []}
    }
    stories = {
      4: {owner_ids: [1], id: 4},
      5: {owner_ids: [2,3], id: 5}
    }
  })
  it('should add iteration stories to correct members', () => {
    mapStoryToMember(members, stories)
    expect(members[1]).toHaveProperty('iteration_stories')
    expect(members[2]).toHaveProperty('iteration_stories')
    expect(members[1].iteration_stories[0].id).toBe(4)
    expect(members[3].iteration_stories[0].id).toBe(5)
  })
})
