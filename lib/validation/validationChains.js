const {isTokenPresent} = require("./validators/isTokenPresent")
const {isTokenValid} = require("./validators/isTokenValid")
const {isProjectIDPresent} = require("./validators/isProjectIDPresent")
const {isProjectIDValid} = require("./validators/isProjectIDValid")
const {isStoryIDValid} = require("./validators/isStoryIDValid")
const {isBranchDefault} = require("./validators/isBranchDefault")

const [
  tokenValidation,
  projectIDValidation,
  linkStory,
  storyValidation] =  
  [
    [isTokenPresent, isTokenValid],
    [isProjectIDPresent, isProjectIDValid],
    [isBranchDefault, isStoryIDValid],
    [isStoryIDValid]
  ]

exports.getValidationChain = function(elementToValidate) {
  switch(elementToValidate){
    case 'token':
      return tokenValidation
    case 'projectID':
      return projectIDValidation
    case 'linkStory':
      return linkStory
    case 'story':
      return storyValidation
  }
}
