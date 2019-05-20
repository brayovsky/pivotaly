const {isFunctionAsync} = require('../helpers/functions')
const {getValidationChain} = require('./validationChains')
const rebounds = require('./rebounds')
const {getActiveBranch} = require("../helpers/git")
const {didBranchChange} = require("./validators/didBranchChange")
const {setState} = require("../helpers/state")
const {getStoryID} = require("../helpers/stories")
const {isBranchDefault} = require("./validators/isBranchDefault")

const validate = async (elementToValidate, context, rebound = false, failMessage = '', actionArgs = []) => {
  const validators = getValidationChain(elementToValidate)
  let didValidationSucceed = true

  for (const validator of validators) {
    const validationSucceded = isFunctionAsync(validator)
      ? await validator(context)
      : validator(context)
    if(!validationSucceded) {
      didValidationSucceed = false
      break
    }
  }

  if (rebound && !didValidationSucceed)
    rebounds(elementToValidate, context, failMessage, actionArgs)

  return new Promise((resolve, reject) => {
    if(didValidationSucceed)
      return resolve(didValidationSucceed)
    return reject(didValidationSucceed)
  })
}

const validateStory = async (context, storyInfoProvider) => {
  const isFeatureBranch = await isBranchDefault()
  if(!isFeatureBranch) return rebounds('defaultBranch', context, '', [context, storyInfoProvider])

  const branchChanged = await didBranchChange(context)
  if(branchChanged) {
    const currentBranch = await getActiveBranch()
    const storyID = await getStoryID(context, currentBranch)
    if (storyID) {
      await setState(context, currentBranch, storyID)
      return rebounds('storyChange', context, '', [context, storyInfoProvider])
    }
    return rebounds('invalidBranchName', context)
  }

  return rebounds('sameStory', context)
}

module.exports = {
  validate,
  validateStory
}
