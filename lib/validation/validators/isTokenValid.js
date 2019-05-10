const PtProjects = require('../../../model/projects')

exports.isTokenValid = async context => {
  const projectResource = new PtProjects(context)
  let projects
  try {
    projects = await projectResource.getAllProjects()
  } catch(e) {
    return false
  }
  const statusCode = projects.res.statusCode
  return statusCode != 403
}
