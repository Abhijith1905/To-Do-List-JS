export class TodoUI {
  constructor(todoList) {
    this.todoList = todoList;
    this.taskList = document.getElementById('task-list');
    this.taskInput = document.getElementById('task-input');
    this.emptyState = document.getElementById('empty-state');
    this.tasksCount = document.getElementById('tasks-count');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.modal = document.getElementById('modal');
    this.editInput = document.getElementById('edit-task-input');
    this.currentEditingId = null;
  }
  
  renderTasks() {
    const tasks = this.todoList.getFilteredTasks();
    this.taskList.innerHTML = '';
    
    tasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.taskList.appendChild(taskElement);
    });
    
    this.checkEmptyState();
  }
  
  createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.dataset.id = task.id;
    
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    
    taskItem.classList.add('fade-in');
    
    taskItem.innerHTML = `
      <label class="task-checkbox">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span class="checkbox-custom"></span>
      </label>
      <span class="task-text">${this.escapeHTML(task.text)}</span>
      <div class="task-actions-container">
        <button class="task-delete-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
    
    this.setupDragAndDrop(taskItem);
    
    return taskItem;
  }
  
  setupDragAndDrop(taskElement) {
    taskElement.setAttribute('draggable', 'true');
    
    taskElement.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', taskElement.dataset.id);
      taskElement.classList.add('dragging');
      setTimeout(() => {
        taskElement.classList.add('hidden');
      }, 0);
    });
    
    taskElement.addEventListener('dragend', () => {
      taskElement.classList.remove('dragging', 'hidden');
    });
    
    taskElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingEl = document.querySelector('.dragging');
      if (!draggingEl || draggingEl === taskElement) return;
      
      const rect = taskElement.getBoundingClientRect();
      const y = e.clientY;
      const threshold = rect.top + rect.height / 2;
      
      if (y < threshold) {
        this.taskList.insertBefore(draggingEl, taskElement);
      } else {
        this.taskList.insertBefore(draggingEl, taskElement.nextSibling);
      }
    });
    
    taskElement.addEventListener('drop', (e) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData('text/plain');
      const sourceIndex = Array.from(this.taskList.children).findIndex(
        el => el.dataset.id === sourceId
      );
      const destIndex = Array.from(this.taskList.children).indexOf(taskElement);
      
      this.todoList.reorderTasks(sourceIndex, destIndex);
      this.renderTasks();
    });
  }
  
  updateTaskCount() {
    const count = this.todoList.getActiveTasksCount();
    this.tasksCount.textContent = `${count} task${count !== 1 ? 's' : ''} left`;
  }
  
  checkEmptyState() {
    const filteredTasks = this.todoList.getFilteredTasks();
    if (filteredTasks.length === 0) {
      this.emptyState.classList.remove('hidden');
      this.taskList.classList.add('hidden');
    } else {
      this.emptyState.classList.add('hidden');
      this.taskList.classList.remove('hidden');
    }
  }
  
  updateFilterButtons() {
    this.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === this.todoList.currentFilter);
    });
  }
  
  clearTaskInput() {
    this.taskInput.value = '';
    this.taskInput.focus();
  }
  
  showEditModal(id, text) {
    this.currentEditingId = id;
    this.editInput.value = text;
    this.modal.classList.remove('hidden');
    this.modal.classList.add('show');
    this.editInput.focus();
    
    // Add a small delay before focusing to ensure transition completes
    setTimeout(() => {
      this.editInput.focus();
    }, 100);
  }
  
  hideEditModal() {
    this.modal.classList.remove('show');
    // Wait for transition to complete before adding hidden class
    setTimeout(() => {
      this.modal.classList.add('hidden');
      this.currentEditingId = null;
    }, 300);
  }
  
  escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}