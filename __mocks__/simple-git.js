// __mocks__/simple-git.js
module.exports = async () => {
  return {
    branchLocal: async () => {
      return (err = false, branchSummary) => {{true}}
    }
  }
};