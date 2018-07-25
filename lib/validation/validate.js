const {isFunctionAsync} = require('../helpers/functions')
const {getValidationChain} = require('./validationChains')


exports.validate = async (elementToValidate, context) => {
  const validators = getValidationChain(elementToValidate)
  let didValidationSucceed = true
  await Promise.all(
    validators.map(async function(validator){
      const result = isFunctionAsync(validator)
        ? await validator(context)
        : validator(context)
      console.log('result', result)
      didValidationSucceed = didValidationSucceed && result
    })
  )
  return didValidationSucceed
  // rebound
}
