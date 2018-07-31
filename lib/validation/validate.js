const {isFunctionAsync} = require('../helpers/functions')
const {getValidationChain} = require('./validationChains')
const {rebounds} = require('./rebounds')
const {getActiveBranch} = require("../helpers/git")
const {didBranchChange} = require("./validators/didBranchChange")
const {workspace} = require("vscode")
const {getStoryID, setState} = require("../helpers/pivotaly")


exports.validate = async (elementToValidate, context, rebound = false) => {
  const validators = getValidationChain(elementToValidate)
  let didValidationSucceed = true

  for (const validator of validators) {
    const result = isFunctionAsync(validator)
      ? await validator(context)
      : validator(context)
    if(!result) {
      didValidationSucceed = false
      break
    }
  }

  if (rebound && !didValidationSucceed)
    return rebounds(elementToValidate, {context})

  return new Promise(function(resolve) {
    resolve(didValidationSucceed)
  })
}

exports.validateStory = async (context) => {
  const branchChanged = await didBranchChange(context)
  if(branchChanged) {
    const currentBranch = await getActiveBranch()
    const protectedBranches = workspace.getConfiguration().get('pivotaly.protectedBranches')

    if(protectedBranches.includes(currentBranch)) {
      return rebounds('defaultBranch', context)
    }
    else {
      const storyID = await getStoryID(context, currentBranch)
      if (storyID) {
        await setState(context, currentBranch, storyID)
        return rebounds("storyChange", context)
      }
      return rebounds('invalidBranchName', context)
    }
  }
  else {
    return rebounds('sameStory', context)
  }
}
