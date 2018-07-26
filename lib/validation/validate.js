const {isFunctionAsync} = require('../helpers/functions')
const {getValidationChain} = require('./validationChains')
const {rebounds} = require('./rebounds')


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
    console.log("rebound")
    rebounds(elementToValidate, {context})

  return didValidationSucceed
}
 