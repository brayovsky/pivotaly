const { Factory } = require('rosie')
const Chance = require('chance')

const chance = new Chance()

module.exports = new Factory()
  .attr('workspaceState', () => chance.pickone([
    {
      get: function(key){ 
        const state = {
          branch: chance.string(),
          story: chance.string(),
          isChore: chance.bool(),
          storyDetails:{}
        }
        const workspaceState = { 
          "pivotaly.state": JSON.stringify(state),
          "pivotaly.isARepo": chance.bool(),
          "pivotaly.projectID": chance.integer()
        }
        return workspaceState[key]
      },
      update: function(stateKey, newState){ return new Promise(resolve => resolve(newState))},
    }
  ]))
  .attr('subscriptions', [])
