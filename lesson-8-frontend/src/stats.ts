import type { Task } from './types';

export function updateTotalTasks(count: number): void {
  document.querySelector('#totalTasks')!.textContent = count.toString();
}

export function updateStatusCounts(tasks: Task[]): void {
  const counts = tasks.reduce((acc, t) => {
    acc[t.status]++;
    return acc;
  }, { todo: 0, in_progress: 0, done: 0 });

  document.querySelector('#todoCount')!.textContent = counts.todo.toString();
  document.querySelector('#inProgressCount')!.textContent = counts.in_progress.toString();
  document.querySelector('#doneCount')!.textContent = counts.done.toString();
}

export function updatePriorityCounts(tasks: Task[]): void {
  const counts = tasks.reduce((acc, t) => {
    acc[t.priority]++;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  document.querySelector('#highPriorityCount')!.textContent = counts.high.toString();
  document.querySelector('#mediumPriorityCount')!.textContent = counts.medium.toString();
  document.querySelector('#lowPriorityCount')!.textContent = counts.low.toString();
}

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

export function updateStatistics(tasks: Task[]): void {
  updateTotalTasks(tasks.length);
  updateStatusCounts(tasks);
  updatePriorityCounts(tasks);
  updateUpcomingDeadlines(tasks);
}
