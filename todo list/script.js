const taskInput = document.querySelector("#task-input");
const taskListDiv = document.querySelector("#task-list");
let deleteButtons, editButtons, taskElements;
let editMode = "";
let taskCount;

window.onload = () => {
  editMode = "";
  taskCount = Object.keys(localStorage).length;
  renderTasks();
};

const renderTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    taskListDiv.style.display = "block";
  } else {
    taskListDiv.style.display = "none";
  }

  taskListDiv.innerHTML = "";

  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let value = localStorage.getItem(key);
    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");
    taskDiv.setAttribute("id", key);
    taskDiv.innerHTML = `<span class="task-name">${key.split("_")[1]}</span>`;
    let editButton = document.createElement("button");
    editButton.classList.add("task-edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskDiv.classList.add("task-completed");
    }
    taskDiv.appendChild(editButton);
    taskDiv.innerHTML += `<button class="task-delete"><i class="fa-solid fa-trash"></i></button>`;
    taskListDiv.appendChild(taskDiv);
  }

  taskElements = document.querySelectorAll(".task-item");
  taskElements.forEach((element) => {
    element.onclick = () => {
      if (element.classList.contains("task-completed")) {
        updateLocalStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateLocalStorage(element.id.split("_")[0], element.innerText, true);
      }
    };
  });

  editButtons = document.getElementsByClassName("task-edit");
  Array.from(editButtons).forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      disableEditButtons(true);
      let parent = element.parentElement;
      taskInput.value = parent.querySelector(".task-name").innerText;
      editMode = parent.id;
      parent.remove();
    });
  });

  deleteButtons = document.getElementsByClassName("task-delete");
  Array.from(deleteButtons).forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      removeTaskFromStorage(parent.id);
      parent.remove();
      taskCount -= 1;
    });
  });
};

const disableEditButtons = (disable) => {
  let editButtons = document.getElementsByClassName("task-edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = disable;
  });
};

const removeTaskFromStorage = (taskId) => {
  localStorage.removeItem(taskId);
  renderTasks();
};

const updateLocalStorage = (index, taskValue, isCompleted) => {
  localStorage.setItem(`${index}_${taskValue}`, isCompleted);
  renderTasks();
};

document.querySelector("#add-task-btn").addEventListener("click", () => {
  disableEditButtons(false);
  if (taskInput.value.length == 0) {
    alert("Please enter a task");
  } else {
    if (editMode === "") {
      updateLocalStorage(taskCount, taskInput.value, false);
    } else {
      let existingCount = editMode.split("_")[0];
      removeTaskFromStorage(editMode);
      updateLocalStorage(existingCount, taskInput.value, false);
      editMode = "";
    }
    taskCount += 1;
    taskInput.value = "";
  }
});