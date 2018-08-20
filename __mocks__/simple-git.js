// __mocks__/simple-git.js
module.exports = () => {
  return {
    branchLocal: async () => {
      return (err = false, branchSummary) => {{true}}
    },
    checkIsRepo: async (cb) => {
      cb(1)
    }
  }
}
