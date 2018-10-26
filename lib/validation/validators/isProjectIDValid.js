const PtProject = require('../../../model/projects')

exports.isProjectIDValid = async context => {
  const projectResource = new PtProject(context)
  const project = await projectResource.getProject()
  const statusCode = project.res.statusCode
  return statusCode != 404 && statusCode != 403
}
