export class TodoEvents {
  constructor(todoList, todoUI) {
    this.todoList = todoList;
    this.todoUI = todoUI;
    
    // DOM Elements
    this.taskForm = document.getElementById('task-form');
    this.taskInput = document.getElementById('task-input');
    this.taskList = document.getElementById('task-list');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.clearCompletedBtn = document.getElementById('clear-completed-btn');
    this.deleteAllBtn = document.getElementById('delete-all-btn');
    this.cancelEditBtn = document.getElementById('cancel-edit-btn');
    this.saveEditBtn = document.getElementById('save-edit-btn');
    this.modal = document.getElementById('modal');
  }
  
  initializeEvents() {
    // Form submission (add task)
    this.taskForm.addEventListener('submit', this.handleAddTask.bind(this));
    
    // Task actions (delete, toggle completion, edit)
    this.taskList.addEventListener('click', this.handleTaskActions.bind(this));
    this.taskList.addEventListener('dblclick', this.handleTaskDoubleClick.bind(this));
    
    // Filter buttons
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', this.handleFilterChange.bind(this));
    });
    
    // Clear completed button
    this.clearCompletedBtn.addEventListener('click', this.handleClearCompleted.bind(this));
    
    // Delete all button
    this.deleteAllBtn.addEventListener('click', this.handleDeleteAll.bind(this));
    
    // Edit modal buttons
    this.cancelEditBtn.addEventListener('click', () => this.todoUI.hideEditModal());
    this.saveEditBtn.addEventListener('click', this.handleSaveEdit.bind(this));
    
    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.todoUI.hideEditModal();
      }
    });
    
    // Handle keyboard events in edit modal
    document.getElementById('edit-task-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleSaveEdit();
      } else if (e.key === 'Escape') {
        this.todoUI.hideEditModal();
      }
    });
    
    // Handle keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.todoUI.hideEditModal();
      }
    });
  }
  
  handleAddTask(e) {
    e.preventDefault();
    const text = this.taskInput.value;
    if (!text.trim()) return;
    
    const newTask = this.todoList.addTask(text);
    if (newTask) {
      this.todoUI.renderTasks();
      this.todoUI.updateTaskCount();
      this.todoUI.clearTaskInput();
    }
  }
  
  handleTaskActions(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.dataset.id;
    
    // Handle checkbox toggle
    if (e.target.type === 'checkbox' || e.target.closest('.task-checkbox')) {
      this.todoList.toggleTaskCompletion(taskId);
      this.todoUI.renderTasks();
      this.todoUI.updateTaskCount();
    }
    
    // Handle delete button
    if (e.target.closest('.task-delete-btn')) {
      // Add the fade-out animation
      taskItem.classList.add('fade-out');
      
      // Wait for animation to complete before actually removing
      setTimeout(() => {
        this.todoList.deleteTask(taskId);
        this.todoUI.renderTasks();
        this.todoUI.updateTaskCount();
      }, 250);
    }
  }
  
  handleTaskDoubleClick(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem || e.target.closest('.task-checkbox') || e.target.closest('.task-delete-btn')) {
      return;
    }
    
    const taskId = taskItem.dataset.id;
    const taskTextElement = taskItem.querySelector('.task-text');
    const taskText = taskTextElement.textContent;
    
    this.todoUI.showEditModal(taskId, taskText);
  }
  
  handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    this.todoList.setFilter(filter);
    this.todoUI.updateFilterButtons();
    this.todoUI.renderTasks();
  }
  
  handleClearCompleted() {
    this.todoList.clearCompleted();
    this.todoUI.renderTasks();
    this.todoUI.updateTaskCount();
  }
  
  handleDeleteAll() {
    if (confirm('Are you sure you want to delete all tasks?')) {
      this.todoList.deleteAllTasks();
      this.todoUI.renderTasks();
      this.todoUI.updateTaskCount();
    }
  }
  
  handleSaveEdit() {
    const newText = this.todoUI.editInput.value;
    if (this.todoUI.currentEditingId && newText.trim()) {
      this.todoList.updateTask(this.todoUI.currentEditingId, newText);
      this.todoUI.renderTasks();
      this.todoUI.hideEditModal();
    }
  }
}