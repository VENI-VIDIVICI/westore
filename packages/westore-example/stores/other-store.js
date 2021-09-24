
const { Store, update } = require('westore')
const Log = require('../models/log')
const Todo = require('../models/todo')

class OtherStore extends Store {
  constructor() {
    super()
    this.data = {
      logsSize: [],
      todoTitle: '',
      todos: [],
      count: 18,

      left: 1,
      done: 1,
      type: 'all'
    }

    this.log = new Log()
    this.todo = new Todo()

    this.todo.subscribe(() => {
      this.data.todos = this.todo.todos
      this.computeCount()
      this.update()
    })

  }

  init() {
    this.data.todos = this.todo.todos
    this.log.loadLogs()
    this.data.logsSize = this.log.logs.length
    this.update()
  }

  addTodo() {
    if (this.data.todoTitle.trim() === '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })

      return
    }
    this.todo.addTodo(this.data.todoTitle)
    this.data.todoTitle = ''
    this.update()
  }

  toggle(id) {
    this.todo.toggle(id)
  }

  destroy(id) {
    this.todo.destroy(id)
  }

  computeCount() {
    this.data.left = 0
    this.data.done = 0
    for (let i = 0, len = this.data.todos.length; i < len; i++) {
      this.data.todos[i].done ? this.data.done++ : this.data.left++
    }
  }

  clearDone() {
    this.todo.clearDone()
  }

  filter(type) {
    this.data.type = type
    this.update()
  }
}


module.exports = new OtherStore