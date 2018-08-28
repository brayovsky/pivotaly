const {model} = require('../../model')
const propertyToKey = require('../adapters/propertyToKey')
const mapCycleTimeToStory = require('../adapters/mapCycleTimeToStory')
const memberIdToKey = require('../adapters/memberIdToKey')
const mapStoryToMember = require('../adapters/mapStoryToMember')
const renderTemplates = require('../stats/renderTemplates')
const createDoc = require('../stats/createDoc')
const statsCss = require('../stats/css/statsStyle')
const {window, ViewColumn} = require('vscode')

module.exports = async context => {
  const members = await model.getMemberships(context)
  const allMembersById = memberIdToKey(members.data)

  const currentIteration = await model.getIterations(context, 'current')
  const allIterationStories = propertyToKey(currentIteration.data[0].stories, 'id')
  const iterationCycle = await model.getIterationCycleTime(context, currentIteration.data[0].number)

  mapCycleTimeToStory(allIterationStories, iterationCycle.data)
  mapStoryToMember(allMembersById, allIterationStories)

  const dataView = renderTemplates(allMembersById)
  const statsHtml = createDoc(dataView, statsCss)
  const statsPanel = window.createWebviewPanel('pivotaly.stats', 'Statistics', ViewColumn.One, {enableFindWidget: true})
  statsPanel.webview.html = statsHtml
}
