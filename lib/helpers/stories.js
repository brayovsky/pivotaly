const {workspace} = require("vscode")
const {isStoryIDValid} = require("../validation/validators/isStoryIDValid")

const getStoryID = async (context, branch) => {
  const delimiter = workspace.getConfiguration().get('pivotaly.branchDelimiter')
  const splitBranch = branch.split(delimiter)
  const postStoryID = splitBranch.pop()
  const preStoryID = splitBranch[0]

  const isPostStoryValid = await isStoryIDValid(context, postStoryID)
  if(isPostStoryValid)
    return postStoryID
  
  const isPreStoryValid = await isStoryIDValid(context, preStoryID)
  if(isPreStoryValid)
    return preStoryID
  return undefined
}

module.exports = {
  getStoryID,
}
