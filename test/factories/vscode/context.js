const { Factory } = require('rosie')
const Chance = require('chance')

const chance = new Chance()

module.exports = new Factory()
  .attr('workspaceState', () => chance.pickone([
    {
      get: function(){ return '{ "state":"pivotaly.state"}'},
      update: function(){ return '{ "state":"pivotaly.update"}'},
    }
  ]))