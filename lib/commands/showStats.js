const {model} = require('../../model')
const propertyToKey = require('../adapters/propertyToKey')
const mapCycleTimeToStory = require('../adapters/mapCycleTimeToStory')
const memberIdToKey = require('../adapters/memberIdToKey')
const mapStoryToMember = require('../adapters/mapStoryToMember')

module.exports = async context => {
  const members = await model.getMemberships(context)
  const allMembersById = memberIdToKey(members.data)

  const currentIteration = await model.getIterations(context, 'current')
  const allIterationStories = propertyToKey(currentIteration.data[0].stories, 'id')
  const iterationCycle = await model.getIterationCycleTime(context, currentIteration.data[0].number)

  mapCycleTimeToStory(allIterationStories, iterationCycle.data)
  mapStoryToMember(allMembersById, allIterationStories)
}
