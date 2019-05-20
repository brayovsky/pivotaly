// __mocks__/vscode.js

module.exports = {
  workspace: {
    get: function(){ return {valueOne: 'one'}},
    workspaceFolders: [
      {
        uri: {
          fsPath: 'rootPath'
        }
      }
    ],

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
  TreeItem: class {
    constructor(label) {
      this.label = label
    }
  },
  TreeItemCollapsibleState: {
    Collapsed: 1,
    None: 2
  },
  EventEmitter: class {},
  commands: {
    executeCommand: jest.fn()
  }
}
