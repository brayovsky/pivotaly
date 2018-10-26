const {window} = require('vscode')
const {common} = require('../commands/common')
const {model, PtProject} = require('../../model')
const {generateQuickPickArray, extractIdFromQuickPick} = require('../adapters/generateQuickPickArray')

const onFailure = () => {
  window.showInformationMessage('Project ID could not be set')
}

exports.registerProjectID = async context => {
  const prompt = 'Pick a project for this workspace'

  const projectResource = new PtProject(context)
  const allProjects = (await projectResource.getAllProjects(['id', 'name'])).data
  const allProjectsQuickPick = generateQuickPickArray(allProjects)
  const project = window.showQuickPick(allProjectsQuickPick, {canPickMany: false, ignoreFocusOut: true, placeHolder: prompt})

  return project.then(projectNameAndId => {
    if(!projectNameAndId){
      return onFailure()
    }
    const projectId = extractIdFromQuickPick(projectNameAndId)
    context.workspaceState.update(common.globals.projectID, projectId)
    window.showInformationMessage('Project ID updated successfully')
  }, onRej => onFailure())
}
