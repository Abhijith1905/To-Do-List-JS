export class TodoStorage {
  constructor() {
    this.storageKey = 'taskmaster-todos';
  }
  
  getTasks() {
    const storedTasks = localStorage.getItem(this.storageKey);
    return storedTasks ? JSON.parse(storedTasks) : [];
  }
  
  saveTasks(tasks) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}