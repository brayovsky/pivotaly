// __mocks__/vscode.js
module.exports = {
  workspace: {
    get: function(){ return {valueOne: 'one'}},
    rootPath: 'rootPath',
    getConfiguration: function () {
      return {
        get: function() {
          return '-'
        },
      }
    },
  },
  window: {
    showInformationMessage: function(){return {valueOne: 'one'}},
    showInputBox: function () {
        return 'storyId'
    },
    createStatusBarItem: function () {
      return {
        show: function () {
          return {}
        }
      }
    },
  },
  StatusBarAlignment: {
    right: 'right'
  },
}