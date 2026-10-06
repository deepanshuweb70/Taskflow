import './App.css'

const tasks = [
  { title: 'Design login page', project: 'Website Redesign', status: 'In Progress', priority: 'High' },
  { title: 'Write project brief', project: 'Mobile App', status: 'To Do', priority: 'Medium' },
  { title: 'Review homepage', project: 'Website Redesign', status: 'Review', priority: 'Low' },
  { title: 'Set up project', project: 'Mobile App', status: 'Done', priority: 'High' },
]

const columns = ['To Do', 'In Progress', 'Review', 'Done']

function App() {
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
          <button className="primary-button">＋ &nbsp; New task</button>
        </div>

        <div className="stats">
          <article className="stat-card"><span>Total tasks</span><strong>24</strong><small>Across all projects</small></article>
          <article className="stat-card"><span>In progress</span><strong>08</strong><small>Tasks being worked on</small></article>
          <article className="stat-card"><span>Completed</span><strong>12</strong><small>Great work this month</small></article>
          <article className="stat-card"><span>Overdue</span><strong>02</strong><small>Needs your attention</small></article>
        </div>

        <div className="board-heading" id="board">
          <div><p className="eyebrow">OVERVIEW</p><h2>My task board</h2></div>
          <button className="filter-button">☷ &nbsp; Filter</button>
        </div>

        <div className="board">
          {columns.map((column) => (
            <section className="column" key={column}>
              <h3>{column}<span>{tasks.filter((task) => task.status === column).length}</span></h3>
              {tasks.filter((task) => task.status === column).map((task) => (
                <article className="task-card" key={task.title}>
                  <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span>
                  <h4>{task.title}</h4>
                  <p>{task.project}</p>
                  <div className="task-footer"><span>👤 &nbsp;You</span><span>Oct 10</span></div>
                </article>
              ))}
              <button className="add-task">＋ Add task</button>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App