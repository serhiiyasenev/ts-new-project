import './style.css';
import { TaskAPI } from './api';
import type { Task } from './types';

// Initialize the app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>Task Manager</h1>

    <div class="dashboard-layout">
    <!-- Task Creation Form -->
      <div class="task-form">
        <h2>Create New Task</h2>
        <form id="taskForm">
          <input type="text" name="title" placeholder="Task Title" required>
          <textarea name="description" placeholder="Task Description" required></textarea>
          <select name="status" required>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select name="priority" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="date" name="deadline">
          <button type="submit">Create Task</button>
        </form>
      </div>

      <!-- Right Side: Statistics Dashboard -->
      <div class="statistics-dashboard">
        <h2>Statistics Dashboard</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Tasks</h3>
            <p id="totalTasks">0</p>
          </div>
          <div class="stat-card">
            <h3>Tasks by Status</h3>
            <div id="tasksByStatus">
              <div class="stat-item">
                <span class="stat-label">Todo:</span>
                <span id="todoCount">0</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">In Progress:</span>
                <span id="inProgressCount">0</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Done:</span>
                <span id="doneCount">0</span>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <h3>Tasks by Priority</h3>
            <div id="tasksByPriority">
              <div class="stat-item">
                <span class="stat-label">High:</span>
                <span id="highPriorityCount">0</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Medium:</span>
                <span id="mediumPriorityCount">0</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Low:</span>
                <span id="lowPriorityCount">0</span>
              </div>
            </div>
          </div>
          <div class="stat-card">
            <h3>Upcoming Deadlines</h3>
            <div id="upcomingDeadlines">
              <!-- Will be populated dynamically -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <div class="task-column">
        <h2>TODO</h2>
        <div id="todoList"></div>
      </div>
      <div class="task-column">
        <h2>IN PROGRESS</h2>
        <div id="inProgressList"></div>
      </div>
      <div class="task-column">
        <h2>DONE</h2>
        <div id="doneList"></div>
      </div>
    </div>
  </div>
`;

// Add event listeners and initialize functionality
async function init() {
  const taskForm = document.querySelector<HTMLFormElement>('#taskForm')!;

  // Load and render tasks
  async function loadTasks() {
    try {
      const tasks = await TaskAPI.getAllTasks();
      renderTasks(tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  // Update dashboard statistics
  function updateStatistics(tasks: Task[]) {
    // Update total tasks
    document.querySelector('#totalTasks')!.textContent = tasks.length.toString();

    // Count tasks by status
    const statusCounts = {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length
    };

    document.querySelector('#todoCount')!.textContent = statusCounts.todo.toString();
    document.querySelector('#inProgressCount')!.textContent = statusCounts.in_progress.toString();
    document.querySelector('#doneCount')!.textContent = statusCounts.done.toString();

    // Count tasks by priority
    const priorityCounts = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };

    document.querySelector('#highPriorityCount')!.textContent = priorityCounts.high.toString();
    document.querySelector('#mediumPriorityCount')!.textContent = priorityCounts.medium.toString();
    document.querySelector('#lowPriorityCount')!.textContent = priorityCounts.low.toString();

    // Update upcoming deadlines
    const upcomingDeadlines = tasks
      .filter(task => task.deadline && new Date(task.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 3);

    document.querySelector('#upcomingDeadlines')!.innerHTML = upcomingDeadlines.length
      ? upcomingDeadlines.map(task => `
          <div class="stat-item">
            <span class="stat-label">${task.title.slice(0, 20)}${task.title.length > 20 ? '...' : ''}</span>
            <span>${new Date(task.deadline!).toLocaleDateString()}</span>
          </div>
        `).join('')
      : '<div class="stat-item">No upcoming deadlines</div>';
  }

  // Render tasks in the UI
  function renderTasks(tasks: Task[]) {
    const todoList = document.querySelector('#todoList')!;
    const inProgressList = document.querySelector('#inProgressList')!;
    const doneList = document.querySelector('#doneList')!;

    // Update statistics
    updateStatistics(tasks);

    // Clear all lists
    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    doneList.innerHTML = '';

    // Sort tasks by creation date (newest first) and render them in appropriate columns
    tasks.forEach(task => {
      const taskHtml = `
        <div class="task-item" data-id="${task.id}">
          <div class="task-header">
            <h3>${task.title}</h3>
            <div class="task-badges">
              <span class="badge priority-${task.priority}">${task.priority.toLowerCase()}</span>
            </div>
          </div>
          <p>${task.description}</p>
          <div class="task-meta">
            <span>Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
            ${task.deadline ? `<span>Deadline: ${new Date(task.deadline).toLocaleDateString()}</span>` : ''}
          </div>
          <div class="task-actions">
            <button onclick="editTask('${task.id}')">Edit</button>
            <button onclick="deleteTask('${task.id}')">Delete</button>
          </div>
        </div>
      `;

      // Add task to appropriate column
      switch(task.status) {
        case 'todo':
          todoList.insertAdjacentHTML('beforeend', taskHtml);
          break;
        case 'in_progress':
          inProgressList.insertAdjacentHTML('beforeend', taskHtml);
          break;
        case 'done':
          doneList.insertAdjacentHTML('beforeend', taskHtml);
          break;
      }
    });
  }

  // Handle form submission
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(taskForm);
    const newTask: Omit<Task, 'id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      createdAt: new Date(),
      deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : null
    };

    try {
      await TaskAPI.createTask(newTask);
      taskForm.reset();
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  });

  // Delete task handler
  (window as any).deleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskAPI.deleteTask(id);
        await loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Edit task handler
  (window as any).editTask = async (id: string) => {
    try {
      const task = await TaskAPI.getTaskById(id);
      // Here you would typically open a modal or form for editing
      // For now, we'll use prompt for simplicity
      const newTitle = prompt('Enter new title:', task.title);
      if (newTitle) {
        await TaskAPI.updateTask(id, { ...task, title: newTitle });
        await loadTasks();
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Initial load
  await loadTasks();
}

init();
