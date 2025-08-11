// cache DOM nodes
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// create a task <li> element (separated so structure is consistent)
function createTaskElement(text) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = text;

  const btns = document.createElement('div');
  btns.className = 'task-btns';

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button'; // ensure not treated as submit
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = '✓';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '✕';

  btns.appendChild(completeBtn);
  btns.appendChild(deleteBtn);
  li.appendChild(span);
  li.appendChild(btns);
  return li;
}

// add new task to the DOM
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    // small UX hint: focus input
    taskInput.focus();
    return;
  }
  const li = createTaskElement(text);
  taskList.appendChild(li);
  taskInput.value = '';
  taskInput.focus();
}

// attach Add listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// EVENT DELEGATION: single listener for complete/delete
taskList.addEventListener('click', (e) => {
  const target = e.target;

  // If user clicked the complete button
  if (target.matches('.complete-btn')) {
    const li = target.closest('.task-item');
    if (!li) return;
    // toggle completed class on the li (CSS handles text strike-through)
    li.classList.toggle('completed');
    return;
  }

  // If user clicked the delete button
  if (target.matches('.delete-btn')) {
    const li = target.closest('.task-item');
    if (!li) return;

    // small fade out before removing (trying out things)
    li.style.transition = 'opacity 180ms ease, transform 180ms ease';
    li.style.opacity = '0';
    li.style.transform = 'translateY(-6px)';
    setTimeout(() => li.remove(), 180);
    return;
  }
});

// Add this after your other event listeners
const filterSection = document.querySelector('.filter-section');
if (filterSection) {
  filterSection.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    const filter = e.target.dataset.filter; // 'all', 'completed', 'incomplete'
    Array.from(taskList.children).forEach(li => {
      if (filter === 'all') {
        li.style.display = '';
      } else if (filter === 'completed') {
        li.style.display = li.classList.contains('completed') ? '' : 'none';
      } else if (filter === 'incomplete') {
        li.style.display = li.classList.contains('completed') ? 'none' : '';
      }
    });
  });
}
