const {isFunctionAsync} = require('../helpers/functions')
const {getValidationChain} = require('./validationChains')
const {rebounds} = require('./rebounds')


exports.validate = async (elementToValidate, context, rebound = false) => {
  const validators = getValidationChain(elementToValidate)
  let didValidationSucceed = true
  await Promise.all(
    validators.map(async function(validator){
      const result = isFunctionAsync(validator)
        ? await validator(context)
        : validator(context)
      didValidationSucceed = didValidationSucceed && result
    })
  )
  console.log("validation", didValidationSucceed)
  if (rebound && !didValidationSucceed)
    rebounds(elementToValidate)
  return didValidationSucceed
}
