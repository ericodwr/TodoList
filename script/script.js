const submitForm = document.getElementById('form');
const uncompletedList = document.getElementById('todos');
const completedList = document.getElementById('completed-todos');
const TODO_ITEMID = 'itemId';

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener('ondatasaved', () => {
  console.log('Data berhasil di simpan!');
});

document.addEventListener('ondataloaded', () => {
  refreshDataFromTodos();
});

submitForm.addEventListener('submit', function (event) {
  event.preventDefault();
  addTodo();
});

function addTodo() {
  const textTitle = document.getElementById('title').value;
  const textTimestamp = document.getElementById('date').value;

  const todo = makeTodo(textTitle, textTimestamp);
  const todoObject = composeTodoObject(textTitle, textTimestamp, false);

  todo[TODO_ITEMID] = todoObject.id;
  todos.push(todoObject);

  uncompletedList.append(todo);
  updateDataToStorage();
  console.log(textTitle, textTimestamp);
}

function makeTodo(data, date, isCompleted) {
  const title = document.createElement('h2');
  title.innerText = data;

  const timestap = document.createElement('p');
  timestap.innerText = date;

  const listContainer = document.createElement('div');
  listContainer.classList.add('inner');
  listContainer.append(title, timestap);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(listContainer);

  if (isCompleted) {
    container.append(trashButton());
    container.append(undoButton());
  } else {
    container.append(checkButton());
  }

  return container;
}

function createCheckButton(buttonTypeClass, eventListener) {
  const button = document.createElement('button');
  button.classList.add(buttonTypeClass);

  button.addEventListener('click', function (event) {
    eventListener(event);
  });
  return button;
}

function taskClear(taskElement) {
  const textTitle = taskElement.querySelector('.inner > h2').innerText;
  const textTimestamp = taskElement.querySelector('.inner > p').innerText;

  const newTodo = makeTodo(textTitle, textTimestamp, true);

  const todo = findTodo(taskElement[TODO_ITEMID]);
  todo.isCompleted = true;
  newTodo[TODO_ITEMID] = todo.id;

  completedList.append(newTodo);

  taskElement.remove();

  updateDataToStorage();
}

function checkButton() {
  return createCheckButton('check-button', function (event) {
    taskClear(event.target.parentElement);
  });
}

function removeTask(taskElement) {
  const todoPosition = findTodoIndex(taskElement[TODO_ITEMID]);
  todos.splice(todoPosition, 1);

  taskElement.remove();
  updateDataToStorage();
}

function trashButton() {
  return createCheckButton('trash-button', function (event) {
    removeTask(event.target.parentElement);
  });
}

function undoList(taskElement) {
  const textTitle = taskElement.querySelector('.inner > h2').innerText;
  const textTimestamp = taskElement.querySelector('.inner > p').innerText;

  const newTodo = makeTodo(textTitle, textTimestamp, false);

  const todo = findTodo(taskElement[TODO_ITEMID]);
  todo.isCompleted = false;
  newTodo[TODO_ITEMID] = todo.id;

  uncompletedList.append(newTodo);

  taskElement.remove();
  updateDataToStorage();
}

function undoButton() {
  return createCheckButton('undo-button', function (event) {
    undoList(event.target.parentElement);
  });
}

// function anotherlist(taskElement) {
//     const newList = makeTodo(data, date);
// }
