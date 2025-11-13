import { useState } from 'react';
import { CreateTaskForm } from './components/createTask/CreateTaskForm';
import { Statistics } from './components/statistics/Statistics';
import { TaskList } from './components/taskList/TaskList';
import { EditTaskModal } from './components/editTask/EditTaskModal';
import { Toast } from './components/toast/Toast';
import { useToast } from './hooks/useToast';
import type { Task } from './types/types';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast, showError, showSuccess, closeToast } = useToast();

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleTaskUpdated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleTaskMoved = () => {
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
      
      <div className="header-grid">
        <div className="header-create">
          <CreateTaskForm 
            onTaskCreated={handleTaskCreated}
            onError={showError}
            onSuccess={showSuccess}
          />
        </div>
        <div className="header-stats">
          <Statistics refreshTrigger={refreshKey} />
        </div>
      </div>

      <TaskList 
        key={refreshKey} 
        onEditTask={handleEditTask}
        onTaskMoved={handleTaskMoved}
        onError={showError}
      />
      
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseModal}
          onTaskUpdated={handleTaskUpdated}
          onError={showError}
          onSuccess={showSuccess}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  )
}

export default App
