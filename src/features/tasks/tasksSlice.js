import { createSlice } from '@reduxjs/toolkit'

const startingTasks = [
  { id: 'task-1', title: 'Design login page', project: 'Website Redesign', status: 'In Progress', priority: 'High' },
  { id: 'task-2', title: 'Write project brief', project: 'Mobile App', status: 'To Do', priority: 'Medium' },
  { id: 'task-3', title: 'Review homepage', project: 'Website Redesign', status: 'Review', priority: 'Low' },
  { id: 'task-4', title: 'Set up project', project: 'Mobile App', status: 'Done', priority: 'High' },
]

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem('taskflow-tasks')

    if (!savedTasks) return startingTasks

    const parsedTasks = JSON.parse(savedTasks)
    if (!Array.isArray(parsedTasks)) return startingTasks

    return parsedTasks.map((task, index) => ({
      ...task,
      id: task.id || `saved-${Date.now()}-${index}`,
    }))
  } catch {
    return startingTasks
  }
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadTasks(),
  reducers: {
    addTask(state, action) {
      state.unshift(action.payload)
    },
    deleteTask(state, action) {
      return state.filter((task) => task.id !== action.payload)
    },
    updateTask(state, action) {
      const task = state.find((item) => item.id === action.payload.id)
      if (task) Object.assign(task, action.payload.changes)
    },
    changeTaskStatus(state, action) {
      const task = state.find((item) => item.id === action.payload.id)
      if (task) task.status = action.payload.status
    },
  },
})

export const { addTask, deleteTask, updateTask, changeTaskStatus } =
  tasksSlice.actions

export default tasksSlice.reducer