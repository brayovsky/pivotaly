const {window} = require('vscode')
const {common} = require('../commands/common')
const PtProject = require('../../model/projects')
const {generateQuickPickArray, extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')

const onFailure = () =>
  window.showInformationMessage('Project ID could not be set')

const onFailedFetch = () => window.showErrorMessage('Could not fetch projects')

module.exports = async (context, statusBarItem) => {
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
      return onFailure()
    }
    const projectId = extractIdFromQuickPick(projectNameAndId)
    if(projectId == notAPtProjectId) {
      context.workspaceState.update(common.globals.notPTProject, true)
      window.showInformationMessage('Workspace marked as not a pivotal tracker project. Reload to apply all changes')
      statusBarItem.dispose();
      return
    }
    context.workspaceState.update(common.globals.projectID, projectId)
    window.showInformationMessage('Project ID updated successfully')
  }, _onRej => onFailure())
}
