import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addTask,
  changeTaskStatus,
  deleteTask,
  updateTask,
} from './features/tasks/tasksSlice'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useDraggable, useDroppable, DragDropProvider } from '@dnd-kit/react'
import './App.css'

// const startingTasks = []
 

const columns = ['To Do', 'In Progress', 'Review', 'Done']

function DraggableTask({ id, children }) {
  const { ref } = useDraggable({ id })

  return (
    <article ref={ref} className="task-card">
      {children}
    </article>
  )
}

function DroppableColumn({ id, children }) {
  const { ref, isDropTarget } = useDroppable({ id })

  return (
    <section
      ref={ref}
      className={`column ${isDropTarget ? 'drop-target' : ''}`}
    >
      {children}
    </section>
  )
}

function App() {
  const tasks = useSelector((state) => state.tasks)
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [project, setProject] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [theme, setTheme] = useState(() => {
  const savedTheme = localStorage.getItem('taskflow-theme')

  if (savedTheme) return savedTheme

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
})

const statusChartData = ['To Do', 'In Progress', 'Review', 'Done'].map((status) => ({
  status,
  total: tasks.filter((task) => task.status === status).length,
}))

    useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

    useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('taskflow-theme', theme)
  }, [theme])

   function handleDeleteTask(taskToDelete) {
  dispatch(deleteTask(taskToDelete.id))
}

    function handleStartCreate() {
    setEditingTask(null)
    setTitle('')
    setProject('')
    setPriority('Medium')
    setIsModalOpen(true)
  }


  function handleStartEdit(task) {
  setEditingTask(task)
  setTitle(task.title)
  setProject(task.project)
  setPriority(task.priority)
  setIsModalOpen(true)
}

function handleChangeStatus(taskToUpdate, newStatus) {
  dispatch(
    changeTaskStatus({
      id: taskToUpdate.id,
      status: newStatus,
    })
  )
}

function handleDragEnd(event) {
  if (event.canceled) return

  const taskId = event.operation.source.id
  const newStatus = event.operation.target?.id
  const draggedTask = tasks.find((task) => String(task.id) === String(taskId))

  if (!draggedTask || !columns.includes(newStatus)) return

  dispatch(
    changeTaskStatus({
      id: draggedTask.id,
      status: newStatus,
    })
  )
}

function handleAddTask(event) {
  event.preventDefault()

  if (!title.trim()) return

  if (editingTask) {
    dispatch(
      updateTask({
        id: editingTask.id,
        changes: {
          title: title.trim(),
          project: project.trim() || 'General',
          priority,
        },
      })
    )
  } else {
    dispatch(
      addTask({
        id: crypto.randomUUID(),
        title: title.trim(),
        project: project.trim() || 'General',
        status: 'To Do',
        priority,
      })
    )
  }

  setEditingTask(null)
  setTitle('')
  setProject('')
  setPriority('Medium')
  setIsModalOpen(false)
}


  const inProgressCount = tasks.filter((task) => task.status === 'In Progress').length
  const completedCount = tasks.filter((task) => task.status === 'Done').length

  const filteredTasks = tasks.filter((task) => {
  const query = searchTerm.trim().toLowerCase()

  const matchesSearch =
    task.title.toLowerCase().includes(query) ||
    task.project.toLowerCase().includes(query)

  const matchesStatus =
    statusFilter === 'All' || task.status === statusFilter

  const matchesPriority =
    priorityFilter === 'All' || task.priority === priorityFilter

  return matchesSearch && matchesStatus && matchesPriority
})

  return (
    <main className="app">
      <aside className="sidebar">
        <h1 className="brand">Task<span>Flow</span></h1>
        <p className="nav-label">WORKSPACE</p>
        <a className="nav-item active" href="#dashboard">▦ &nbsp; Dashboard</a>
        <a className="nav-item" href="#board">▤ &nbsp; My Tasks</a>
        <a className="nav-item" href="#projects">▧ &nbsp; Projects</a>
        <div className="sidebar-bottom">⚙ &nbsp; Settings</div>
      </aside>

      <section className="content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">TUESDAY, OCTOBER 6</p>
            <h2>Good morning, Deepanshu 👋</h2>
          </div>
          <div className="topbar-actions">
          <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
              {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
              </button>
              <button className="avatar" aria-label="Your profile">D</button>
          </div>
        </header>

        <div className="welcome">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h2>Make today productive.</h2>
            <p>Keep track of your projects and move your best work forward.</p>
          </div>
          <button className="primary-button" onClick={handleStartCreate}>
            ＋ &nbsp; New task
          </button>
        </div>

        <div className="stats">
          <article className="stat-card"><span>Total tasks</span><strong>{tasks.length}</strong><small>Across all projects</small></article>
          <article className="stat-card"><span>In progress</span><strong>{inProgressCount}</strong><small>Tasks being worked on</small></article>
          <article className="stat-card"><span>Completed</span><strong>{completedCount}</strong><small>Great work this month</small></article>
          <article className="stat-card"><span>Overdue</span><strong>0</strong><small>Needs your attention</small></article>
        </div>

                <section className="chart-card">
          <h2>Tasks by status</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#6258e8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="board-heading" id="board">
          <div><p className="eyebrow">OVERVIEW</p><h2>My task board</h2></div>
          <div className="board-controls">
              <input
              className="search-input"
              type="search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search tasks"
           />

        <select
             value={statusFilter}
             onChange={(event) => setStatusFilter(event.target.value)}
             aria-label="Filter by status"
       >
             <option value="All">All statuses</option>
             {columns.map((status) => (
             <option key={status} value={status}>{status}</option>
         ))}
       </select>

       <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              aria-label="Filter by priority"
       >
              <option value="All">All priorities</option>
              <option value="Low">Low priority</option>
              <option value="Medium">Medium priority</option>
              <option value="High">High priority</option>
       </select>
      </div>
        </div>


        <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="board">
          {columns.map((column) => (
            <DroppableColumn id={column} key={column}>
              <h3>{column}<span>{filteredTasks.filter((task) => task.status === column).length}</span></h3>
              {filteredTasks.filter((task) => task.status === column).map((task, index) => (
               <DraggableTask id={task.id} key={task.id}> 
                  <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span>
                  <h4>{task.title}</h4>
                   <select
                    className="status-select"
                    value={task.status}
                    onChange={(event) => handleChangeStatus(task, event.target.value)}
                    aria-label={`Change status for ${task.title}`}
                  >
                    {columns.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <p>{task.project}</p>
                  <div className="task-footer"><span>👤 &nbsp;You</span><span>Oct 10</span></div>
                  <div className="task-actions">
                   <button
                    type="button"
                    className="edit-task"
                    onClick={() => handleStartEdit(task)}
                  >
                    
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-task"
                    onClick={() => handleDeleteTask(task)}
                  >
                    Delete
                  </button>
                  </div> 
                </DraggableTask>
              ))}
              <button className="add-task" onClick={handleStartCreate}>＋ Add task</button>
            </DroppableColumn>
          ))}
        </div>
        </DragDropProvider>
      </section>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <section
            className="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
           <h2 id="modal-title">{editingTask ? 'Edit task' : 'Create a task'}</h2>
            <form onSubmit={handleAddTask}>
              <label>
                Task name
                <input
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Design the homepage"
                  required
                />
              </label>
              <label>
                Project
                <input
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  placeholder="e.g. Website Redesign"
                />
              </label>
              <label>
                Priority
                <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="filter-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-button">
                {editingTask ? 'Save changes' : 'Save task'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
