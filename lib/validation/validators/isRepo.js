const simpleGit = require("simple-git")

module.exports = rootPath => new Promise(resolve => {
  simpleGit(rootPath).checkIsRepo((err, isRepo) => {
    if(err) return resolve(false)
    return resolve(isRepo)
  })
})
