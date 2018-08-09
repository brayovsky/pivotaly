const {isFunctionAsync} = require('../helpers/functions')
const {getValidationChain} = require('./validationChains')
const {rebounds} = require('./rebounds')
const {getActiveBranch} = require("../helpers/git")
const {didBranchChange} = require("./validators/didBranchChange")
const {getStoryID, setState} = require("../helpers/pivotaly")
const {isBranchDefault} = require("./validators/isBranchDefault")

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
    return rebounds(elementToValidate, context)

  return new Promise((resolve) => {
    resolve(didValidationSucceed)
  })
}

exports.validateStory = async (context) => {
  const isFeatureBranch = await isBranchDefault()
  if(!isFeatureBranch) return rebounds('defaultBranch', context)
  const branchChanged = await didBranchChange(context)
  if(branchChanged) {
    const currentBranch = await getActiveBranch()
    const storyID = await getStoryID(context, currentBranch)
    if (storyID) {
      await setState(context, currentBranch, storyID)
      return rebounds("storyChange", context)
    }
    return rebounds('invalidBranchName', context)
  }
  return rebounds('sameStory', context)
}
