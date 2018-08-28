const { Factory } = require('rosie')
const Chance = require('chance')

const chance = new Chance()

module.exports = new Factory().attr('user1', () => ({
    person: {
      name: chance.string()
    },
    iteration_stories: [{
      story_type: chance.pickone(['feature', 'bug', 'chore']),
      url: chance.string(),
      name: chance.string(),
      current_state: chance.string(),
      iteration_details: {
        total_cycle_time: chance.integer(),
        started_count: chance.integer(),
        started_time: chance.integer(),
        finished_count: chance.integer(),
        finished_time: chance.integer(),
        delivered_count: chance.integer(),
        delivered_time: chance.integer(),
        rejected_count: chance.integer(),
        rejected_time: chance.integer()
      }
  }]
}))
