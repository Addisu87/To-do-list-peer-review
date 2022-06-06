import './style.css';

const DisplayTodos = () => {
  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';

  todos
    .sort((a, b) => a.index - b.index)
    .forEach((todo) => {
      const todoItem = document.createElement('div');
      todoItem.classList.add('todo-item');

      const label = document.createElement('label');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = todo.done;
      label.appendChild(input);

      const span = document.createElement('span');
      span.classList.add('bubble');
      label.appendChild(span);

      const content = document.createElement('div');
      content.classList.add('todo-content');
      content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;

      const actions = document.createElement('div');
      actions.classList.add('actions');

      const edit = document.createElement('button');
      edit.classList.add('edit');
      edit.innerHTML = 'Edit';
      actions.appendChild(edit);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete');
      deleteButton.innerHTML = 'Delete';
      actions.appendChild(deleteButton);

      todoItem.appendChild(label);
      todoItem.appendChild(content);
      todoItem.appendChild(actions);

      todoList.appendChild(todoItem);

      if (todo.done) {
        todoItem.classList.add('done');
      }

      input.addEventListener('change', (e) => {
        todo.done = e.target.checked;
        localStorage.setItem('todos', JSON.stringify(todos));

        if (todo.done) {
          todoItem.classList.add('done');
        } else {
          todoItem.classList.remove('done');
        }
        DisplayTodos();
      });

      edit.addEventListener('click', () => {
        const input = content.querySelector('input');
        input.removeAttribute('readonly');
        input.focus();
        input.addEventListener('blur', (e) => {
          input.setAttribute('readonly', true);
          todo.content = e.target.value;
          localStorage.setItem('todos', JSON.stringify(todos));
          DisplayTodos();
        });
      });

      deleteButton.addEventListener('click', () => {
        todos = todos.filter((task) => task !== todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        DisplayTodos();
      });
    });
};

const clearAllTasks = () => {
  const clearTasks = document.querySelector('#completed');
  clearTasks.innerHTML = '';

  const removeAll = document.createElement('button');
  removeAll.classList.add('completed');
  removeAll.innerHTML = 'Remove All';

  clearTasks.appendChild(removeAll);

  removeAll.addEventListener('click', () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const notRemoved = todos.filter((todo) => !todo.done);
    localStorage.clear('todos');
    localStorage.setItem('todos', JSON.stringify(notRemoved));
    DisplayTodos();
  });
};

const showAlert = (message, className) => {
  const div = document.createElement('div');
  div.className = `alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const form = document.querySelector('#new-todo-form');
  const submitBtn = document.querySelector('#submit-btn');
  form.insertBefore(div, submitBtn);

  // Vanish in 2 seconds
  setTimeout(() => document.querySelector('.alert').remove(), 2000);
};

window.addEventListener('load', () => {
  const todos = (JSON.parse(localStorage.getItem('todos')) || []).filter(
    (todo) => todo.content !== ''
  );
  const newTodoForm = document.querySelector('#new-todo-form');

  newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const todo = {
      content: e.target.elements.content.value,
      done: false,
      createdAt: new Date().getTime()
    };

    // Validate
    if (todo.content === '') {
      showAlert('Please fill in the field', 'danger');
    } else {
      showAlert('To-do list added', 'success');
      todos.push(todo);
      localStorage.setItem('todos', JSON.stringify(todos));
      DisplayTodos();
    }

    // Reset the form
    e.target.reset();
  });

  DisplayTodos();
  clearAllTasks();
});
