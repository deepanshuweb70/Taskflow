import { useState } from 'react'
import './App.css'

const startingTasks = [
  { title: 'Design login page', project: 'Website Redesign', status: 'In Progress', priority: 'High' },
  { title: 'Write project brief', project: 'Mobile App', status: 'To Do', priority: 'Medium' },
  { title: 'Review homepage', project: 'Website Redesign', status: 'Review', priority: 'Low' },
  { title: 'Set up project', project: 'Mobile App', status: 'Done', priority: 'High' },
]

const columns = ['To Do', 'In Progress', 'Review', 'Done']

function App() {
  const [tasks, setTasks] = useState(startingTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [project, setProject] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [editingTask, setEditingTask] = useState(null)

    function handleDeleteTask(taskToDelete) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task !== taskToDelete)
    )
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
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task === taskToUpdate
        ? { ...task, status: newStatus }
        : task
    )
  )
}

  function handleAddTask(event) {
  event.preventDefault()

  if (!title.trim()) return

  if (editingTask) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task === editingTask
          ? {
              ...task,
              title: title.trim(),
              project: project.trim() || 'General',
              priority,
            }
          : task
      )
    )
  } else {
    const newTask = {
      title: title.trim(),
      project: project.trim() || 'General',
      status: 'To Do',
      priority,
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
  }

  setEditingTask(null)
  setTitle('')
  setProject('')
  setPriority('Medium')
  setIsModalOpen(false)
}
  const inProgressCount = tasks.filter((task) => task.status === 'In Progress').length
  const completedCount = tasks.filter((task) => task.status === 'Done').length

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
          <button className="avatar" aria-label="Your profile">D</button>
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

        <div className="board-heading" id="board">
          <div><p className="eyebrow">OVERVIEW</p><h2>My task board</h2></div>
          <button className="filter-button">☷ &nbsp; Filter</button>
        </div>

        <div className="board">
          {columns.map((column) => (
            <section className="column" key={column}>
              <h3>{column}<span>{tasks.filter((task) => task.status === column).length}</span></h3>
              {tasks.filter((task) => task.status === column).map((task, index) => (
                <article className="task-card" key={`${task.title}-${index}`}>
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
                </article>
              ))}
              <button className="add-task" onClick={handleStartCreate}>＋ Add task</button>
            </section>
          ))}
        </div>
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
