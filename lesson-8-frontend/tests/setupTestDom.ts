// Helper to create minimal DOM for Vitest
export function setupTestDom(): void {
  document.body.innerHTML = `
    <div id="modal-overlay"></div>
    <form id="taskForm"></form>
    <form id="edit-task-form"></form>
    <span id="totalTasks">0</span>
    <span id="todoCount">0</span>
    <span id="inProgressCount">0</span>
    <span id="doneCount">0</span>
    <span id="lowPriorityCount">0</span>
    <span id="mediumPriorityCount">0</span>
    <span id="highPriorityCount">0</span>
    <div id="upcomingDeadlines"></div>
    <div id="todoList" data-status="todo"></div>
    <div id="inProgressList" data-status="in_progress"></div>
    <div id="doneList" data-status="done"></div>
  `;
}