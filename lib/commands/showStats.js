const {window, ViewColumn} = require('vscode')
const {formatDate} = require('../utils/date')
const PtIterations = require('../../model/iterations')
const PtAccounts = require('../../model/accounts')
const propertyToKey = require('../adapters/propertyToKey')
const mapCycleTimeToStory = require('../adapters/mapCycleTimeToStory')
const memberIdToKey = require('../adapters/memberIdToKey')
const mapStoryToMember = require('../adapters/mapStoryToMember')
const getAllMemberCards = require('../stats/getAllMemberCards')
const createDoc = require('../stats/createDoc')
const statsCss = require('../stats/css/statsStyle')

const onFail = () => window.showErrorMessage('Could not get member cycle')

module.exports = async (context, scope = 'current', iterationNumber = 0) => {
  const accountResource = new PtAccounts(context)
  let members
  try {
    members = await accountResource.getMemberships()
  } catch (error) {
    onFail()
  }
  const allMembersById = memberIdToKey(members.data)

  const iterationsResource = new PtIterations(context)
  let iterations
  try {
    iterations = await iterationsResource.getIterations(scope)    
  } catch (error) {
    onFail()
  }
  const iterationIndex = iterationNumber ? iterationNumber - 1 : 0
  const  allIterationStories = propertyToKey(iterations.data[iterationIndex].stories, 'id')
  
  const itNumber = iterationNumber || iterations.data[0].number
  const iterationCycle = await iterationsResource.getIterationCycleTime(itNumber)

  mapCycleTimeToStory(allIterationStories, iterationCycle.data)
  mapStoryToMember(allMembersById, allIterationStories)

  const dataView = getAllMemberCards(allMembersById)
  const statsHtml = createDoc(dataView, statsCss)
  const startDate = formatDate(iterations.data[iterationIndex].start, 'DD.MM.YY')
  const statsPanel = window.createWebviewPanel('pivotaly.stats', `Statistics - ${startDate}`, ViewColumn.One, {enableFindWidget: true})
  statsPanel.webview.html = statsHtml
}
