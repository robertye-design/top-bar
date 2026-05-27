import { useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Design new homepage layout', priority: 'high', completed: false },
    { id: 2, text: 'Review user feedback from last sprint', priority: 'medium', completed: true },
    { id: 3, text: 'Update documentation', priority: 'low', completed: false },
    { id: 4, text: 'Test mobile responsiveness', priority: 'high', completed: false },
  ])
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          priority: 'medium',
          completed: false,
        },
      ])
      setNewTask('')
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <p className="subtitle">Use the "Add Comment" button in the top bar to leave feedback on this prototype</p>

      <div className="add-task">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks yet. Add one above!</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <div className={`task-text ${task.completed ? 'completed' : ''}`}>
                {task.text}
              </div>
              <div className={`task-priority ${task.priority}`}>
                {task.priority}
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
