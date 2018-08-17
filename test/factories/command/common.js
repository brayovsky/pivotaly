const { Factory } = require('rosie')
const Chance = require('chance')

const chance = new Chance()

module.exports = new Factory()
  .attr('globals', () => chance.pickone([
    {
      APItoken: "pivotaly.APItoken",
      projectID: "pivotaly.projectID"
    }
  ]))
