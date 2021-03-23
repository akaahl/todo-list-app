// Declare variables
const body = document.body;
const dayModeBtn = document.getElementById("day-mode");
const nightModeBtn = document.getElementById("night-mode");
const formContainer = document.getElementById("form-container");
const ulContainer = document.getElementById("ul-container");
const footerItems = document.getElementById("footer-items");
const itemsLeft = document.getElementById("no-of-items");
const buttons = document.querySelectorAll("button");
const showAllBtn = document.getElementById("show-all");
const showActiveBtn = document.getElementById("show-active");
const showCompletedBtn = document.getElementById("show-completed");
const clearCompletedBtn = document.getElementById("clear-completed");
const checkbox = document.querySelectorAll(".cross-checklist");
let inputText = document.getElementById("create-list-text");
let liElement;

// Dark / light mode
dayModeBtn.addEventListener("click", () => {
  dayModeBtn.style.display = "none";
  nightModeBtn.style.display = "block";
  body.classList.toggle("light-mode");
});

nightModeBtn.addEventListener("click", () => {
  dayModeBtn.style.display = "block";
  nightModeBtn.style.display = "none";
  body.classList.toggle("light-mode");
});

function updateTodoItems() {
  const completedList = document.querySelectorAll(".completed").length;
  const incompleteList = document.querySelectorAll(".list-container").length;

  if (completedList) {
    itemsLeft.innerHTML = `${incompleteList - completedList} items left`;
  } else if (!completedList) {
    itemsLeft.innerHTML = `${ulContainer.childElementCount - 1} items left`;
  }

  // For checkboxes
  const checkbox = document.querySelectorAll(".cross-checklist");
  checkbox.forEach((item) => {
    item.addEventListener("change", () => {
      let checkedItems = Array.from(checkbox).filter((item) => item.checked);
      itemsLeft.innerHTML = `${
        ulContainer.childElementCount - checkedItems.length - 1
      } items left`;

      if (item.checked) {
        item.parentElement.parentElement.classList.add("completed");
      } else {
        item.parentElement.parentElement.classList.remove("completed");
      }
    });
  });
}

function deleteItem(arg) {
  const parentElement = arg.parentElement.parentElement.parentElement;
  parentElement.remove();
  updateTodoItems();
}

formContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputText.value) {
    let liContainer = document.createElement("li");
    liContainer.classList.add("list-container");
    liContainer.innerHTML = `
        <div class="individual-list" draggable="true">
                <input type="checkbox" name="list-items-checkbox" class="cross-checklist"/>
                <img src="images/icon-check.svg" alt="check-icon" />
                <div class="todo-items">
                  <span>${inputText.value}</span>
                  <img
                    src="images/icon-cross.svg"
                    alt="cross-icon"
                    class="delete-btn"
                    onclick="deleteItem(this)"
                  />
                </div>
              </div>
    `;

    ulContainer.insertBefore(liContainer, footerItems);
    inputText.value = "";
    dragAndDrop();
    updateTodoItems();
    buttonsEvent();
  }
});

// Buttons event listener
buttons.forEach((button) => {
  liElement = document.querySelectorAll(".list-container");

  button.addEventListener("click", (e) => {
    if (e.target.innerText == "All") {
      liElement.forEach((item) => {
        item.classList.remove("hide");
      });
    } else if (e.target.innerText == "Active") {
      liElement.forEach((item) => {
        if (item.classList.contains("completed")) {
          item.classList.add("hide");
        } else {
          item.classList.remove("hide");
        }
      });
    } else if (e.target.innerText == "Completed") {
      liElement.forEach((item) => {
        if (!item.classList.contains("completed")) {
          item.classList.add("hide");
        } else {
          item.classList.remove("hide");
        }
      });
    } else if (e.target.innerText == "Clear Completed") {
      liElement.forEach((item) => {
        if (item.classList.contains("completed")) {
          item.remove();
        }
      });
      updateTodoItems();
    }
  });
});

function buttonsEvent() {
  buttons.forEach((button) => {
    liElement = document.querySelectorAll(".list-container");

    button.addEventListener("click", (e) => {
      if (e.target.innerText == "All") {
        liElement.forEach((item) => {
          item.classList.remove("hide");
        });
      } else if (e.target.innerText == "Active") {
        liElement.forEach((item) => {
          if (item.classList.contains("completed")) {
            item.classList.add("hide");
          } else {
            item.classList.remove("hide");
          }
        });
      } else if (e.target.innerText == "Completed") {
        liElement.forEach((item) => {
          if (!item.classList.contains("completed")) {
            item.classList.add("hide");
          } else {
            item.classList.remove("hide");
          }
        });
      } else if (e.target.innerText == "Clear Completed") {
        liElement.forEach((item) => {
          if (item.classList.contains("completed")) {
            item.remove();
          }
        });
        updateTodoItems();
      }
    });
  });
}

// Drag and drop feature
function dragAndDrop() {
  const individualList = document.querySelectorAll(".individual-list");
  const listContainer = document.querySelectorAll(".list-container");

  individualList.forEach((list) => {
    list.addEventListener("dragstart", () => {
      list.classList.add("dragging");
    });

    list.addEventListener("dragend", () => {
      list.classList.remove("dragging");
    });
  });

  listContainer.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (afterElement !== undefined) {
        const afterElementParent = afterElement.parentElement;
        const draggableParent = draggable.parentElement;
        afterElementParent.appendChild(draggable);
        draggableParent.appendChild(afterElement);
        if (
          draggableParent.classList.contains("completed") &&
          !afterElementParent.classList.contains("completed")
        ) {
          draggableParent.classList.remove("completed");
          afterElementParent.classList.add("completed");
        } else if (
          afterElementParent.classList.contains("completed") &&
          !draggableParent.classList.contains("completed")
        ) {
          afterElementParent.classList.remove("completed");
          draggableParent.classList.add("completed");
        } else if (
          afterElementParent.classList.contains("completed") &&
          draggableParent.classList.contains("completed")
        ) {
          afterElementParent.appendChild(draggable);
          draggableParent.appendChild(afterElement);
        }
      }
    });
  });
}

// Track the mouse Y position between elements; to be used in dragAndDrop()
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".individual-list:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
