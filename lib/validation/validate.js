const {isFunctionAsync} = require('../helpers/functions')
const {getValidationChain} = require('./validationChains')
const {rebounds} = require('./rebounds')
const {getActiveBranch} = require("../helpers/git")
const {didBranchChange} = require("./validators/didBranchChange")
const {workspace} = require("vscode")
const {getStoryID, setState} = require("../helpers/pivotaly")
const {common} = require("../commands/common")


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

    if(currentBranch in protectedBranches) {
      rebounds('defaultBranch')
    }
    else {
      const storyID = getStoryID(currentBranch)
      storyID ? await setState(context, currentBranch, storyID, true) : rebounds('invalidBranchName', context)
    }
  }
  else {
    rebounds('sameStory')
  }
}
