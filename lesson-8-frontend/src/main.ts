import './style.css';
import { TaskAPI } from './api';
import type { Task } from './types';

// Initialize the app
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="modal-overlay">
    <form class="task-edit-form">
      <h3>Edit Task</h3>
      <div class="form-group">
        <label for="edit-title">Title</label>
        <input type="text" id="edit-title" name="title" required>
      </div>
      <div class="form-group">
        <label for="edit-description">Description</label>
        <textarea id="edit-description" name="description" required></textarea>
      </div>
      <div class="form-group">
        <label for="edit-status">Status</label>
        <select id="edit-status" name="status" required>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-priority">Priority</label>
        <select id="edit-priority" name="priority" required>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-deadline">Deadline</label>
        <input type="date" id="edit-deadline" name="deadline">
      </div>
      <div class="form-actions">
        <button type="button" class="cancel">Cancel</button>
        <button type="submit">Save Changes</button>
      </div>
    </form>
  </div>
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
      const taskEl = document.createElement('div');
      taskEl.className = 'task-item';
      taskEl.setAttribute('draggable', 'true');
      taskEl.dataset.id = task.id;
      
      // Build task header
      const headerDiv = document.createElement('div');
      headerDiv.className = 'task-header';
      const h3 = document.createElement('h3');
      h3.textContent = task.title;
      headerDiv.appendChild(h3);
      const badgesDiv = document.createElement('div');
      badgesDiv.className = 'task-badges';
      const prioritySpan = document.createElement('span');
      prioritySpan.className = `badge priority-${task.priority}`;
      prioritySpan.textContent = task.priority.toLowerCase();
      badgesDiv.appendChild(prioritySpan);
      headerDiv.appendChild(badgesDiv);
      taskEl.appendChild(headerDiv);

      // Description
      const descP = document.createElement('p');
      descP.textContent = task.description;
      taskEl.appendChild(descP);

      // Task meta
      const metaDiv = document.createElement('div');
      metaDiv.className = 'task-meta';
      const createdSpan = document.createElement('span');
      createdSpan.textContent = `Created: ${new Date(task.createdAt).toLocaleDateString()}`;
      metaDiv.appendChild(createdSpan);
      if (task.deadline) {
        const deadlineSpan = document.createElement('span');
        deadlineSpan.textContent = `Deadline: ${new Date(task.deadline).toLocaleDateString()}`;
        metaDiv.appendChild(deadlineSpan);
      }
      taskEl.appendChild(metaDiv);

      // Task actions
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'task-actions';
      const editBtn = document.createElement('button');
      editBtn.className = 'edit';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => editTask(task.id));
      actionsDiv.appendChild(editBtn);
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));
      actionsDiv.appendChild(deleteBtn);
      taskEl.appendChild(actionsDiv);

      // Task edit form
      const form = document.createElement('form');
      form.className = 'task-edit-form';
      // Title input
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.name = 'title';
      titleInput.required = true;
      titleInput.value = task.title;
      form.appendChild(titleInput);
      // Description textarea
      const descTextarea = document.createElement('textarea');
      descTextarea.name = 'description';
      descTextarea.required = true;
      descTextarea.value = task.description;
      form.appendChild(descTextarea);
      // Status select
      const statusSelect = document.createElement('select');
      statusSelect.name = 'status';
      statusSelect.required = true;
      ['todo', 'in_progress', 'done'].forEach(status => {
        const opt = document.createElement('option');
        opt.value = status;
        opt.textContent = status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
        if (task.status === status) opt.selected = true;
        statusSelect.appendChild(opt);
      });
      form.appendChild(statusSelect);
      // Priority select
      const prioritySelect = document.createElement('select');
      prioritySelect.name = 'priority';
      prioritySelect.required = true;
      ['low', 'medium', 'high'].forEach(priority => {
        const opt = document.createElement('option');
        opt.value = priority;
        opt.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
        if (task.priority === priority) opt.selected = true;
        prioritySelect.appendChild(opt);
      });
      form.appendChild(prioritySelect);
      // Deadline input
      const deadlineInput = document.createElement('input');
      deadlineInput.type = 'date';
      deadlineInput.name = 'deadline';
      deadlineInput.value = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
      form.appendChild(deadlineInput);
      // Form actions
      const formActionsDiv = document.createElement('div');
      formActionsDiv.className = 'form-actions';
      const saveBtn = document.createElement('button');
      saveBtn.type = 'submit';
      saveBtn.textContent = 'Save';
      formActionsDiv.appendChild(saveBtn);
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'cancel';
      cancelBtn.textContent = 'Cancel';
      formActionsDiv.appendChild(cancelBtn);
      form.appendChild(formActionsDiv);
      taskEl.appendChild(form);
      // Add drag events
      taskEl.addEventListener('dragstart', (e) => {
        taskEl.classList.add('dragging');
        e.dataTransfer?.setData('text/plain', task.id);
      });

      taskEl.addEventListener('dragend', () => {
        taskEl.classList.remove('dragging');
      });

      // Add form submit handler
      const form = taskEl.querySelector('.task-edit-form') as HTMLFormElement;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedTask = {
          ...task,
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          status: formData.get('status') as string,
          priority: formData.get('priority') as string,
          deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : null
        };
        await TaskAPI.updateTask(task.id, updatedTask);
        form.classList.remove('active');
        await loadTasks();
      });

      // Add cancel button handler
      const cancelBtn = form.querySelector('.cancel') as HTMLButtonElement;
      cancelBtn.addEventListener('click', () => {
        form.classList.remove('active');
      });

      // Add task to appropriate column
      switch(task.status) {
        case 'todo':
          todoList.appendChild(taskEl);
          break;
        case 'in_progress':
          inProgressList.appendChild(taskEl);
          break;
        case 'done':
          doneList.appendChild(taskEl);
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

  // Setup drag and drop for columns
  const columns = document.querySelectorAll('.task-column');
  columns.forEach(column => {
    column.addEventListener('dragover', (e: Event) => {
      e.preventDefault();
      const dragEvent = e as DragEvent;
      if (dragEvent.dataTransfer) {
        dragEvent.dataTransfer.dropEffect = 'move';
      }
      column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => {
      column.classList.remove('drag-over');
    });

    column.addEventListener('drop', async (e: Event) => {
      e.preventDefault();
      column.classList.remove('drag-over');
      
      const dragEvent = e as DragEvent;
      const taskId = dragEvent.dataTransfer?.getData('text/plain');
      if (!taskId) return;

      const newStatus = (column as HTMLElement).dataset.status || 'todo';
      
      try {
        const task = await TaskAPI.getTaskById(taskId);
        await TaskAPI.updateTask(taskId, { ...task, status: newStatus });
        await loadTasks();
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    });
  });

  // Update edit task handler
  (window as any).editTask = async (id: string) => {
    try {
      const task = await TaskAPI.getTaskById(id);
      const modalOverlay = document.querySelector('.modal-overlay');
      const form = document.querySelector('.task-edit-form') as HTMLFormElement;
      
      // Fill form with task data
      (form.querySelector('[name="title"]') as HTMLInputElement).value = task.title;
      (form.querySelector('[name="description"]') as HTMLTextAreaElement).value = task.description;
      (form.querySelector('[name="status"]') as HTMLSelectElement).value = task.status;
      (form.querySelector('[name="priority"]') as HTMLSelectElement).value = task.priority;
      (form.querySelector('[name="deadline"]') as HTMLInputElement).value = 
        task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';

      // Show modal
      modalOverlay?.classList.add('active');
      form.classList.add('active');

      // Handle form submission
      const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedTask = {
          ...task,
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          status: formData.get('status') as string,
          priority: formData.get('priority') as string,
          deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string) : null
        };
        await TaskAPI.updateTask(task.id, updatedTask);
        modalOverlay?.classList.remove('active');
        form.classList.remove('active');
        await loadTasks();
        form.removeEventListener('submit', handleSubmit);
      };

      // Handle cancel
      const handleCancel = () => {
        modalOverlay?.classList.remove('active');
        form.classList.remove('active');
        form.removeEventListener('submit', handleSubmit);
      };

      form.addEventListener('submit', handleSubmit);
      form.querySelector('.cancel')?.addEventListener('click', handleCancel);
      modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) handleCancel();
      });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Initial load
  await loadTasks();
}

init();
