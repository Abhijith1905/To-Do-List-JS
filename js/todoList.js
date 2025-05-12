export class TodoList {
  constructor(storage) {
    this.storage = storage;
    this.tasks = [];
    this.currentFilter = 'all';
  }
  
  loadTasks() {
    this.tasks = this.storage.getTasks();
    return this.tasks;
  }
  
  addTask(text) {
    if (!text.trim()) return null;
    
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    this.storage.saveTasks(this.tasks);
    return newTask;
  }
  
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.storage.saveTasks(this.tasks);
  }
  
  toggleTaskCompletion(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.storage.saveTasks(this.tasks);
      return task;
    }
    return null;
  }
  
  updateTask(id, newText) {
    const task = this.tasks.find(task => task.id === id);
    if (task && newText.trim()) {
      task.text = newText.trim();
      this.storage.saveTasks(this.tasks);
      return task;
    }
    return null;
  }
  
  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.storage.saveTasks(this.tasks);
  }
  
  deleteAllTasks() {
    this.tasks = [];
    this.storage.saveTasks(this.tasks);
  }
  
  setFilter(filter) {
    this.currentFilter = filter;
  }
  
  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'all':
      default:
        return this.tasks;
    }
  }
  
  getActiveTasksCount() {
    return this.tasks.filter(task => !task.completed).length;
  }
  
  reorderTasks(sourceIndex, destinationIndex) {
    // Don't do anything if source and destination are the same
    if (sourceIndex === destinationIndex) return;
    
    const filteredTasks = this.getFilteredTasks();
    const taskToMove = filteredTasks[sourceIndex];
    
    // Create a new array with the task moved to the new position
    filteredTasks.splice(sourceIndex, 1);
    filteredTasks.splice(destinationIndex, 0, taskToMove);
    
    // If we're filtering, we need to update the original tasks array accordingly
    if (this.currentFilter !== 'all') {
      // Create a new tasks array with the filtered tasks in their new order
      const nonFilteredTasks = this.currentFilter === 'active' 
        ? this.tasks.filter(task => task.completed)
        : this.tasks.filter(task => !task.completed);
      
      this.tasks = this.currentFilter === 'active'
        ? [...filteredTasks, ...nonFilteredTasks]
        : [...nonFilteredTasks, ...filteredTasks];
    } else {
      this.tasks = filteredTasks;
    }
    
    this.storage.saveTasks(this.tasks);
  }
}