const {TreeItem} = require('vscode')
const {model} = require('../../../model')
const {commands} = require('../../commands')

class CycleTimeTreeDataProvider {
  constructor(context) {
    this._context = context
  }

  async getChildren() {
    const iterations = await model.getIterations(this._context, 'done')
    return iterations.data
  }

  getTreeItem(iteration) {
    const iterationItem = new TreeItem(`Iteration ${iteration.number}`)
    iterationItem.command = {
      command: commands.statistics.cycleTime,
      title: 'Cycle time'
    }
    return iterationItem
  }

  getParent(element) {
    return element
  }
}

module.exports = CycleTimeTreeDataProvider
