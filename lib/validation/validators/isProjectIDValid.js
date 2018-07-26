const {model} = require("../../../model")

exports.isProjectIDValid = async function(context) {
  console.log("checking in api")
  let statusCode
  try {
    const project = await model.getProject(context)
    statusCode = project.res.statusCode
  } catch (error) {
    statusCode = error.res.statusCode
  } finally {
    return statusCode != 404
  }
}
