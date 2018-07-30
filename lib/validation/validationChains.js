const {isTokenPresent} = require("./validators/isTokenPresent")
const {isTokenValid} = require("./validators/isTokenValid")
const {isProjectIDPresent} = require("./validators/isProjectIDPresent")
const {isProjectIDValid} = require("./validators/isProjectIDValid")
const {didBranchChange} = require("./validators/didBranchChange")

const tokenValidation = [isTokenPresent, isTokenValid]
const projectIDValidation = [isProjectIDPresent, isProjectIDValid]
const storyIDValidation = [didBranchChange]

exports.getValidationChain = function(elementToValidate) {
  switch(elementToValidate){
    case 'token':
      return tokenValidation
    case 'projectID':
      return projectIDValidation
    case 'storyID':
      return didBranchChange
  }
}
