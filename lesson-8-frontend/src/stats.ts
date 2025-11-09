import type { Task } from './types';

// Configuration constants - exported for use in tests
export const MAX_UPCOMING_DEADLINES = 5;
export const MAX_DEADLINE_TITLE_LENGTH = 20;

/**
 * Counts tasks by status and priority in a single pass for better performance.
 * @param tasks - Array of tasks to count
 * @returns Object with status and priority counts
 */
function countTaskMetrics(tasks: Task[]) {
  return tasks.reduce((acc, task) => {
    acc.status[task.status]++;
    acc.priority[task.priority]++;
    return acc;
  }, {
    status: { todo: 0, in_progress: 0, done: 0 },
    priority: { high: 0, medium: 0, low: 0 }
  });
}

/**
 * Updates the total tasks count display in the DOM.
 * Modifies the #totalTasks element's text content.
 * 
 * @param count - The total number of tasks
 */
export function updateTotalTasks(count: number): void {
  const element = document.querySelector('#totalTasks');
  if (element) {
    element.textContent = count.toString();
  }
}

/**
 * Updates the task counts by status in the DOM.
 * Counts tasks in each status category (todo, in_progress, done) and updates
 * the corresponding DOM elements (#todoCount, #inProgressCount, #doneCount).
 * 
 * @param tasks - Array of tasks to count
 */
export function updateStatusCounts(tasks: Task[]): void {
  const counts = tasks.reduce((acc, t) => {
    acc[t.status]++;
    return acc;
  }, { todo: 0, in_progress: 0, done: 0 });

  const todoEl = document.querySelector('#todoCount');
  const inProgressEl = document.querySelector('#inProgressCount');
  const doneEl = document.querySelector('#doneCount');
  
  if (todoEl) todoEl.textContent = counts.todo.toString();
  if (inProgressEl) inProgressEl.textContent = counts.in_progress.toString();
  if (doneEl) doneEl.textContent = counts.done.toString();
}

/**
 * Updates the task counts by priority in the DOM.
 * Counts tasks in each priority category (high, medium, low) and updates
 * the corresponding DOM elements (#highPriorityCount, #mediumPriorityCount, #lowPriorityCount).
 * 
 * @param tasks - Array of tasks to count
 */
export function updatePriorityCounts(tasks: Task[]): void {
  const counts = tasks.reduce((acc, t) => {
    acc[t.priority]++;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  const highEl = document.querySelector('#highPriorityCount');
  const mediumEl = document.querySelector('#mediumPriorityCount');
  const lowEl = document.querySelector('#lowPriorityCount');
  
  if (highEl) highEl.textContent = counts.high.toString();
  if (mediumEl) mediumEl.textContent = counts.medium.toString();
  if (lowEl) lowEl.textContent = counts.low.toString();
}

/**
 * Updates both status and priority counts efficiently in a single pass.
 * More performant than calling updateStatusCounts and updatePriorityCounts separately.
 * 
 * @param tasks - Array of tasks to count
 */
export function updateStatusAndPriorityCounts(tasks: Task[]): void {
  const counts = countTaskMetrics(tasks);
  
  // Update status counts
  const todoEl = document.querySelector('#todoCount');
  const inProgressEl = document.querySelector('#inProgressCount');
  const doneEl = document.querySelector('#doneCount');
  
  if (todoEl) todoEl.textContent = counts.status.todo.toString();
  if (inProgressEl) inProgressEl.textContent = counts.status.in_progress.toString();
  if (doneEl) doneEl.textContent = counts.status.done.toString();
  
  // Update priority counts
  const highEl = document.querySelector('#highPriorityCount');
  const mediumEl = document.querySelector('#mediumPriorityCount');
  const lowEl = document.querySelector('#lowPriorityCount');
  
  if (highEl) highEl.textContent = counts.priority.high.toString();
  if (mediumEl) mediumEl.textContent = counts.priority.medium.toString();
  if (lowEl) lowEl.textContent = counts.priority.low.toString();
}

/**
 * Updates the upcoming deadlines display in the DOM.
 * Shows up to MAX_UPCOMING_DEADLINES tasks with future deadlines, sorted by date (earliest first).
 * Titles longer than MAX_DEADLINE_TITLE_LENGTH characters are truncated with '...'.
 * Modifies the #upcomingDeadlines element's content by first clearing all existing children,
 * then populating it with deadline items or a "No upcoming deadlines" message.
 * 
 * @param tasks - Array of tasks to check for upcoming deadlines
 */
export function updateUpcomingDeadlines(tasks: Task[]): void {
  const upcomingDeadlines = tasks
    .filter(task => task.deadline && new Date(task.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, MAX_UPCOMING_DEADLINES);

  const container = document.querySelector('#upcomingDeadlines');
  if (!container) return;
  
  container.replaceChildren();
  
  if (upcomingDeadlines.length) {
    upcomingDeadlines.forEach(task => {
      const statItem = document.createElement('div');
      statItem.className = 'stat-item';
      
      const label = document.createElement('span');
      label.className = 'stat-label';
      const truncatedTitle = task.title.length > MAX_DEADLINE_TITLE_LENGTH 
        ? task.title.slice(0, MAX_DEADLINE_TITLE_LENGTH) + '...' 
        : task.title;
      label.textContent = truncatedTitle;
      
      const date = document.createElement('span');
      date.textContent = new Date(task.deadline!).toLocaleDateString();
      
      statItem.appendChild(label);
      statItem.appendChild(date);
      container.appendChild(statItem);
    });
  } else {
    const noDeadlines = document.createElement('div');
    noDeadlines.className = 'stat-item';
    noDeadlines.textContent = 'No upcoming deadlines';
    container.appendChild(noDeadlines);
  }
}

/**
 * Updates all statistics displays in the DOM.
 * Calls all other update functions to refresh:
 * - Total tasks count
 * - Status counts (todo, in_progress, done)
 * - Priority counts (high, medium, low)
 * - Upcoming deadlines list
 * 
 * @param tasks - Array of tasks to analyze
 */
export function updateStatistics(tasks: Task[]): void {
  updateTotalTasks(tasks.length);
  updateStatusAndPriorityCounts(tasks); // Combined single-pass update for performance
  updateUpcomingDeadlines(tasks);
}
