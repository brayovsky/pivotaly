jest.mock('../index')
const Model = require('../index')
const Task = require('./index')
const Context = require('../../test/factories/vscode/context')

const context = Context.build()

const PtTask = new Task(context, 1, 'task1')

describe('#tasks', () => {
  describe('getAllTasks', () => {
    test('should fetch using getAllTasks endpoint', () => {
      PtTask.getAllTasks()
      expect(Model.mock.instances[0]._fetch).toBeCalledWith('get', PtTask._taskEndpoints.getAllTasks)
    })
  })

  describe('updateTask', () => {
    test('should update using updateTasks endpoint', () => {
      PtTask.updateTask({complete: true})
      expect(Model.mock.instances[0]._update).toBeCalledWith('put', PtTask._taskEndpoints.updateTask, {complete: true})
    })
  })

  describe('createTask', () => {
    test('should update using createTask endpoint', () => {
      const description = 'new task'
      PtTask.createTask(description)
      expect(Model.mock.instances[0]._update).toBeCalledWith('post', PtTask._taskEndpoints.createTask, {
        description,
        story_id: 1,
        project_id: PtTask._projectId
      })
    })
  })
})
