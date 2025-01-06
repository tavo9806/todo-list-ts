// Selectors
const form = document.querySelector<HTMLFormElement>(".todo--form")!;
const input = document.querySelector<HTMLInputElement>("#todo_value")!;
const submitToDo = document.querySelector<HTMLInputElement>(".todo--submit")!;
const todoList = document.querySelector<HTMLUListElement>("#todo--list")!;

type task = {
  id: number;
  task: string;
};

// Variables
let tasks: task[] = [];

//Events
document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  TasksRender();
  submitToDo.addEventListener("click", addTask);
});

function addTask(e: Event) {
  e.preventDefault();

  const inputText = input.value;
  let task = inputText.trim();
  let isEmptyTask = verifyTask(task);

  const dataId = Number(input.dataset.taskId);

  if (isEmptyTask) {
    //Add Task
    let tempArr:task[] = [];
    if(dataId){
      tempArr = tasks.map(tarea => tarea.id === dataId ? {...tarea, task: task} : tarea);
      tasks = tempArr;
    }
    else {
      tasks = [...tasks, {id: Date.now(), task: task}];
    }
    TasksRender();
  } else 
    return;
}

function verifyTask(task : task["task"]) {
  return task === "" ? false : true;
}

function TasksRender() {

  clearHtml();
  activateStyles();

  localStorage.setItem('tasks', JSON.stringify(tasks));

  const fragment = document.createDocumentFragment();
  tasks.forEach((taskItem) => {

    const {id, task} = taskItem;

    //Crear li
    const li = document.createElement("li");
    li.classList.add("todo--item");
    li.setAttribute("id", id.toString());

    const input = document.createElement("input");
    input.classList.add("todo--checkbox");
    input.type = "checkbox";

    const p = document.createElement("p");
    p.classList.add("todo--task");
    p.textContent = task;

    //Button Container 
    const buttonsContainer = document.createElement("div");
    //Button delete
    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("todo--item--btn");
    buttonDelete.onclick = () => {
      deleteTask(id);
    }
    const spanDelete = document.createElement("span");
    spanDelete.classList.add("material-symbols-outlined");
    spanDelete.textContent = "delete";

    buttonDelete.appendChild(spanDelete);

    //Button edit
    const buttonEdit = document.createElement("button");
    buttonEdit.classList.add("todo--item--btn");
    buttonEdit.onclick = () => {
      editTask(taskItem);
    }

    const spanEdit = document.createElement("span");
    spanEdit.classList.add("material-symbols-outlined");
    spanEdit.textContent = "edit";

    buttonEdit.appendChild(spanEdit);

    //Add btns to container
    buttonsContainer.appendChild(buttonDelete);
    buttonsContainer.appendChild(buttonEdit);

    // Agregar el input y el párrafo al li
    li.appendChild(input);
    li.appendChild(p);
    li.appendChild(buttonsContainer);

    fragment.appendChild(li);
    form.reset();
  });

  todoList.appendChild(fragment);
}

function clearHtml(){
  while(todoList.firstChild){
    todoList.removeChild(todoList.firstChild)
  }
}

function activateStyles(){
  tasks.length > 0 ? todoList.classList.add("todo--list") : todoList.classList.remove("todo--list");
}

function editTask(task:task){
  input.value = task.task;
  input.setAttribute("data-task-id", task.id.toString());
}

function deleteTask(id:task["id"]){
  tasks = tasks.filter(tarea => tarea.id !== id);
  TasksRender();
}