// Create todos
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

function updateItemsLeft() {
  itemsLeft.innerHTML = `${ulContainer.childElementCount - 1} items left`;
}

// updateItemsLeft();

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
                  />
                </div>
              </div>
    `;

    ulContainer.insertBefore(liContainer, footerItems);
    inputText.value = "";
    dragAndDrop();
    updateItemsLeft();
    updateChecklist();
  }
});

// Buttons event listener
// buttons.forEach((button) => {
//   button.addEventListener("click", () => {
//     const checkbox = Array.from(document.querySelectorAll(".cross-checklist"));
//     const checkedLength = checkbox.filter((item) => item.checked).length;
//     const nonCheckedLength = checkbox.filter((item) => !item.checked).length;
//     checkbox.forEach((item) => {
//       const liElement = item.parentElement.parentElement;
//       if (button.innerText == "Active") {
//         if (item.checked) {
//           // document.querySelectorAll(".list-container").forEach((list) => {
//           //   if (list.classList.contains("hide")) {
//           //     list.classList.remove("hide");
//           //   }
//           // });
//           liElement.classList.add("hide");
//         }
//       } else if (button.innerText == "All") {
//         liElement.classList.remove("hide");
//       } else if (button.innerText == "Completed") {
//         if (!item.checked && checkedLength >= 0) {
//           // document.querySelectorAll(".list-container").forEach((list) => {
//           //   if (list.classList.contains("hide")) {
//           //     list.classList.remove("hide");
//           //   }
//           // });
//           liElement.classList.add("hide");
//         }
//       }
//     });
//   });
// });
showAllBtn.addEventListener("click", () => {
  liElement = document.querySelectorAll(".list-container");
  liElement.forEach((item) => {
    item.classList.remove("hide");
  });
});

showActiveBtn.addEventListener("click", () => {
  liElement = document.querySelectorAll(".list-container");
  liElement.forEach((item) => {
    if (item.classList.contains("completed")) {
      item.classList.add("hide");
    } else {
      item.classList.remove("hide");
    }
  });
});

showCompletedBtn.addEventListener("click", () => {
  liElement = document.querySelectorAll(".list-container");
  liElement.forEach((item) => {
    if (!item.classList.contains("completed")) {
      item.classList.add("hide");
    } else {
      item.classList.remove("hide");
    }
  });
});

clearCompletedBtn.addEventListener("click", () => {
  liElement = document.querySelectorAll(".list-container");
  liElement.forEach((item) => {
    if (item.classList.contains("completed")) {
      item.remove();
    }
  });

  updateChecklist();
});

function updateChecklist() {
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

      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
}

// Track the mouse Y position between elements
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
