// Global array to store todos
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Utility to save todos
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Add new todo
function addTodo(title, description, dueDate) {
  const todo = {
    id: Date.now(),
    title,
    description,
    dueDate,
    completed: false
  };
  todos.push(todo);
  saveTodos();
  alert("Todo added!");
}

// Delete all todos
function deleteAllTodos() {
  todos = [];
  saveTodos();
  renderTodos(); // For pages that render list
}

// Mark todo as complete/incomplete
function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

// Render todos to the UI
function renderTodos(filter = "") {
  const list = document.getElementById("todo-list");
  if (!list) return;

  list.innerHTML = "";

  const filtered = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  filtered.forEach(todo => {
    const li = document.createElement("li");
    li.textContent = `${todo.title} - ${todo.description} - Due: ${todo.dueDate}`;
    li.style.textDecoration = todo.completed ? "line-through" : "none";

    li.onclick = () => toggleTodo(todo.id);
    list.appendChild(li);
  });

  document.querySelector(".counter-container span").textContent = filtered.length;
}

// Populate form for editing
function loadTodoForEdit(id) {
  const todo = todos.find(t => t.id === Number(id));
  if (!todo) return;

  document.querySelector('input[name="title"]').value = todo.title;
  document.querySelector('input[name="description"]').value = todo.description;
  document.querySelector('input[name="due-date"]').value = todo.dueDate;

  document.getElementById("update-button").onclick = function () {
    todo.title = document.querySelector('input[name="title"]').value;
    todo.description = document.querySelector('input[name="description"]').value;
    todo.dueDate = document.querySelector('input[name="due-date"]').value;
    saveTodos();
    alert("Todo updated!");
    location.href = "View-todo.html";
  };
}

// Search function
function searchTodos(query) {
  return todos.filter(todo =>
    todo.title.toLowerCase().includes(query.toLowerCase())
  );
}
