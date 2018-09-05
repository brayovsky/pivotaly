const {window, ViewColumn} = require('vscode')
const moment = require('moment')
const {model} = require('../../model')
const propertyToKey = require('../adapters/propertyToKey')
const mapCycleTimeToStory = require('../adapters/mapCycleTimeToStory')
const memberIdToKey = require('../adapters/memberIdToKey')
const mapStoryToMember = require('../adapters/mapStoryToMember')
const getAllMemberCards = require('../stats/getAllMemberCards')
const createDoc = require('../stats/createDoc')
const statsCss = require('../stats/css/statsStyle')

module.exports = async (context, scope = 'current', iterationNumber = 0) => {
  const members = await model.getMemberships(context)
  const allMembersById = memberIdToKey(members.data)

  const iterations = await model.getIterations(context, scope)
  const iterationIndex = iterationNumber ? iterationNumber - 1 : 0
  const  allIterationStories = propertyToKey(iterations.data[iterationIndex].stories, 'id')
  
  const itNumber = iterationNumber || iterations.data[0].number
  const iterationCycle = await model.getIterationCycleTime(context, itNumber)

  mapCycleTimeToStory(allIterationStories, iterationCycle.data)
  mapStoryToMember(allMembersById, allIterationStories)

  const dataView = getAllMemberCards(allMembersById)
  const statsHtml = createDoc(dataView, statsCss)
  const startDate = moment(iterations.data[iterationIndex].start).format('DD.MM.YY')
  const statsPanel = window.createWebviewPanel('pivotaly.stats', `Statistics - ${startDate}`, ViewColumn.One, {enableFindWidget: true})
  statsPanel.webview.html = statsHtml
}
