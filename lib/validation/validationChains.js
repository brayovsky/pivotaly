const {isTokenPresent} = require("./validators/isTokenPresent")
const {isTokenValid} = require("./validators/isTokenValid")

const tokenValidation = [isTokenPresent, isTokenValid]

exports.getValidationChain = function(elementToValidate) {
  switch(elementToValidate){
    case 'token':
      return tokenValidation
  }
}
