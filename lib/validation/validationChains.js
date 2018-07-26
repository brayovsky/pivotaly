const {isTokenPresent} = require("./validators/isTokenPresent")
const {isTokenValid} = require("./validators/isTokenValid")
const {isProjectIDPresent} = require("./validators/isProjectIDPresent")
const {isProjectIDValid} = require("./validators/isProjectIDValid")

const tokenValidation = [isTokenPresent, isTokenValid]
const projectIDValidation = [isProjectIDPresent, isProjectIDValid]

exports.getValidationChain = function(elementToValidate) {
  switch(elementToValidate){
    case 'token':
      return tokenValidation
    case 'projectID':
      return projectIDValidation
  }
}
