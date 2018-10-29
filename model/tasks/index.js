const PtStory = require('../stories')

class PtTask extends PtStory {
  constructor(context, storyId, taskId = '') {
    super(context, storyId)
    this.storyId = storyId
    this.taskId = taskId
    this._baseTasksPath = `${this._baseStoryPath}/tasks`
  }

  get _taskEndpoints() {
    return {
      getAllTasks: this._baseTasksPath,
      updateTask: `${this._baseTasksPath}/${this.taskId}`
    }
  }

  getAllTasks() {
    return this._fetch('get', this._taskEndpoints.getAllTasks)
  }

  updateTask(updateData) {
    return this._update('put', this._taskEndpoints.updateTask, updateData)
  }
}

module.exports = PtTask
