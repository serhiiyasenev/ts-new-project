import type { Task } from './types';

/**
 * Updates the total tasks count display in the DOM.
 * Modifies the #totalTasks element's text content.
 * 
 * @param count - The total number of tasks
 */
export function updateTotalTasks(count: number): void {
  document.querySelector('#totalTasks')!.textContent = count.toString();
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

  document.querySelector('#todoCount')!.textContent = counts.todo.toString();
  document.querySelector('#inProgressCount')!.textContent = counts.in_progress.toString();
  document.querySelector('#doneCount')!.textContent = counts.done.toString();
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

  document.querySelector('#highPriorityCount')!.textContent = counts.high.toString();
  document.querySelector('#mediumPriorityCount')!.textContent = counts.medium.toString();
  document.querySelector('#lowPriorityCount')!.textContent = counts.low.toString();
}

/**
 * Updates the upcoming deadlines display in the DOM.
 * Shows up to 5 tasks with future deadlines, sorted by date (earliest first).
 * Titles longer than 20 characters are truncated with '...'.
 * Modifies the #upcomingDeadlines element's content.
 * 
 * @param tasks - Array of tasks to check for upcoming deadlines
 */
export function updateUpcomingDeadlines(tasks: Task[]): void {
  const upcomingDeadlines = tasks
    .filter(task => task.deadline && new Date(task.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const container = document.querySelector('#upcomingDeadlines')!;
  container.replaceChildren();
  
  if (upcomingDeadlines.length) {
    upcomingDeadlines.forEach(task => {
      const statItem = document.createElement('div');
      statItem.className = 'stat-item';
      
      const label = document.createElement('span');
      label.className = 'stat-label';
      const truncatedTitle = task.title.length > 20 
        ? task.title.slice(0, 20) + '...' 
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
  updateStatusCounts(tasks);
  updatePriorityCounts(tasks);
  updateUpcomingDeadlines(tasks);
}
