const PtProject = require('../../../model/projects')

exports.isProjectIDValid = async context => {
  const projectResource = new PtProject(context)
  let project
  try {
    project = await projectResource.getProject()    
  } catch (error) {
    return false
  }
  const statusCode = project.res.statusCode
  return statusCode != 404 && statusCode != 403
}
