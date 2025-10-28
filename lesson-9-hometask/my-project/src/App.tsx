import { useState } from 'react'
import { CreateTaskForm } from './components/CreateTaskForm'
import { TaskList } from './components/TaskList'
import { EditTaskModal } from './components/EditTaskModal'
import type { Task } from './types'
import './App.css'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleTaskCreated = () => {
    // Trigger refresh of task list by changing key
    setRefreshKey((prev) => prev + 1)
  }

  const handleTaskUpdated = () => {
    // Trigger refresh of task list by changing key
    setRefreshKey((prev) => prev + 1)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleCloseModal = () => {
    setEditingTask(null)
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <CreateTaskForm onTaskCreated={handleTaskCreated} />
      <TaskList key={refreshKey} onEditTask={handleEditTask} />
      
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  )
}

export default App
