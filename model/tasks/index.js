const Model = require('../')

class PtTask extends Model {
  constructor(context, storyId, taskId = '') {
    super(context)
    this.storyId = storyId
    this.taskId = taskId
    this._baseTasksPath = `${this._baseApiPath}/stories/${storyId}/tasks`
  }

  get _endpoints() {
    return {
      getAllTasks: this._baseTasksPath,
      updateTask: `${this._baseTasksPath}/${this.taskId}`
    }
  }

  getAllTasks() {
    return this._fetch('get', this._endpoints.getAllTasks)
  }

  updateTask(updateData) {
    return this._update('put', this._endpoints.updateTask, updateData)
  }
}

module.exports = PtTask
