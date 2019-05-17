const {commands, window} = require('vscode')
const {common} = require('../commands/common')
const PtProject = require('../../model/projects')
const {generateQuickPickArray, extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')
const {validate} = require('../validation/validate')
const rebound = require('../validation/rebounds')
const commandStrings = require('./commands')

const onFailure = msg =>
  window.showWarningMessage(msg)

const onFailedFetch = () => window.showErrorMessage('Could not fetch projects')

module.exports = async (context, storyInfoDataProvider, cycleTimeDataProvider) => {
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
  const project = window.showQuickPick(allProjectsQuickPick, {canPickMany: false, ignoreFocusOut: true, placeHolder: prompt})

  return project.then(projectNameAndId => {
    if(!projectNameAndId){
      return onFailure('Project not updated. Previous project set will be used.')
    }
    const projectId = extractIdFromQuickPick(projectNameAndId)
    if(projectId === notAPtProjectId) {
      context.workspaceState.update(common.globals.notPTProject, true)
      window.showInformationMessage('Workspace marked as not a pivotal tracker project. Pivotaly commands will not be available.')
      context.subscriptions.forEach(el => el.dispose())
      return
    }

    window.showInformationMessage('Validating project id')
    const prevProjectId = context.workspaceState.update(common.globals.projectID, projectId)
    context.workspaceState.update(common.globals.projectID, projectId)

    validate('projectID', context, true, 'Invalid ProjectID. Please pick a valid project.', [context, storyInfoDataProvider, cycleTimeDataProvider]).then(_didProjectValidationSucceed => {
      window.showInformationMessage('Project ID updated successfully')
      rebound('story', context, 'Pick story for project', [context, storyInfoDataProvider])
      commands.executeCommand(commandStrings.commands.storyState.refreshMemberCycleView, [cycleTimeDataProvider])
    }, _failedProjectValidationValue =>
      context.workspaceState.update(common.globals.projectID, prevProjectId)
    )
  }, _onRej => onFailure('Project ID could not be set'))
}
