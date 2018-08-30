const mapCycleTimeToStory = require('./mapCycleTimeToStory')

let stories, iterationCycle

describe('#mapCycleTimeToStory', () => {
  beforeEach(() => {
    stories = {
      1: { id: 1} 
    }

    iterationCycle = [{
      story_id: 1,
      cycle_time: 5,
    }]
  })

  it('should add iteration details property with cycle details as value', () => {
    mapCycleTimeToStory(stories, iterationCycle)
    expect(stories[1]).toHaveProperty('iteration_details')
    expect(stories[1].iteration_details).toHaveProperty('story_id', 1)
    expect(stories[1].iteration_details).toHaveProperty('cycle_time', 5)
  })

  it('should map to the correct id', () => {
    iterationCycle[0].story_id = 2
    mapCycleTimeToStory(stories, iterationCycle)
    expect(stories[1]).not.toHaveProperty('iteration_details')
    
  })
})
