const {window, ViewColumn} = require('vscode')
const {Converter} = require('showdown')

module.exports = (descMarkDown) => {
  const converter = new Converter()
  const descHtml = converter.makeHtml(descMarkDown)
  const descPanel = window.createWebviewPanel('pivotaly.storyDescription', 'Story Description', ViewColumn.One, {enableFindWidget: true})
  descPanel.webview.html = descHtml
}
