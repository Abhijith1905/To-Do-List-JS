import { TodoList } from './todoList.js';
import { TodoUI } from './todoUI.js';
import { TodoStorage } from './todoStorage.js';
import { TodoEvents } from './todoEvents.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Create instances of our modules
  const storage = new TodoStorage();
  const todoList = new TodoList(storage);
  const todoUI = new TodoUI(todoList);
  
  // Initialize event handlers
  const events = new TodoEvents(todoList, todoUI);
  events.initializeEvents();
  
  // Load and render initial tasks
  todoList.loadTasks();
  todoUI.renderTasks();
  todoUI.updateTaskCount();
  todoUI.checkEmptyState();
});