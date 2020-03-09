const {commands, window} = require('vscode')
const {common} = require('../commands/common')
const PtProject = require('../../model/projects')
const {generateQuickPickArray, extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')
const {validate} = require('../validation/validate')
const commandStrings = require('./commands')
const {setUpNotPtProjectEnvironment, executeCommands} = require('../helpers/workspace')

const onFailedFetch = () => window.showErrorMessage('Could not fetch projects')

module.exports = async context => {
  const prompt = 'Pick a project for this workspace'

  const projectResource = new PtProject(context)
  let allProjects
  try {
    allProjects = (await projectResource.getAllProjects(['id', 'name'])).data    
  } catch (error) {
    return onFailedFetch()
  }
  const notAPtProjectId = '!This is not a Pivotal Tracker Project'
  allProjects.push({name: '', id: notAPtProjectId})
  const allProjectsQuickPick = generateQuickPickArray(allProjects)

  const projectNameAndId = await window.showQuickPick(allProjectsQuickPick, {
    canPickMany: false,
    ignoreFocusOut: true,
    placeHolder: prompt
  })

  if(!projectNameAndId) return

  const projectId = extractIdFromQuickPick(projectNameAndId)

  if(projectId === notAPtProjectId) {
    setUpNotPtProjectEnvironment(context, true)
    return
  }

  window.showInformationMessage('Validating project id')

  const prevProjectId = context.workspaceState.get(common.globals.projectID, projectId)
  await context.workspaceState.update(common.globals.projectID, projectId)

  try {
    await validate('projectID', context, true, 'Invalid ProjectID. Please pick a valid project.')
    window.showInformationMessage('Project ID updated successfully')
    executeCommands(
      commandStrings.commands.workState.linkStory,
      commandStrings.commands.storyState.refreshMemberCycleView,
      commandStrings.commands.storyState.refreshBacklog
    )
  } catch (e) {
    if(!e && context.workspaceState.get(common.globals.projectID, projectId) === projectId) {
      context.workspaceState.update(common.globals.projectID, prevProjectId)
    }
  }
}
