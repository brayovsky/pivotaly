const {isTokenPresent} = require("./validators/isTokenPresent")
const {isTokenValid} = require("./validators/isTokenValid")
const {isProjectIDPresent} = require("./validators/isProjectIDPresent")
const {isProjectIDValid} = require("./validators/isProjectIDValid")
const {isStoryIDValid} = require("./validators/isStoryIDValid")
const {isBranchDefault} = require("./validators/isBranchDefault")

const tokenValidation = [isTokenPresent, isTokenValid]
const projectIDValidation = [isProjectIDPresent, isProjectIDValid]
const linkStory = [isBranchDefault, isStoryIDValid]
const storyValidation = [isStoryIDValid]

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
