const {workspace} = require("vscode")
const {isStoryIDValid} = require("../validation/validators/isStoryIDValid")

const getStoryID = async (context, branch) => {
  const delimiter = new RegExp(workspace.getConfiguration().get('pivotaly.branchDelimiter'))
  const splitBranch = branch.split(delimiter)
  const allStories = splitBranch.map(element => isStoryIDValid(context, element))
  const validStoryIds = await Promise.all(allStories)
  const storyIndex = validStoryIds.findIndex(el => el)

  if(storyIndex === -1) {
    return undefined
  }
  return splitBranch[storyIndex]
}

module.exports = {
  getStoryID,
}
