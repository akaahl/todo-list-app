// Create todos
const formContainer = document.getElementById("form-container");
const ulContainer = document.getElementById("ul-container");
const footerItems = document.getElementById("footer-items");
const itemsLeft = document.getElementById("no-of-items");
const buttons = document.querySelectorAll("button");
let inputText = document.getElementById("create-list-text");

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

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const checkbox = Array.from(
          document.querySelectorAll(".cross-checklist")
        );

        checkbox.forEach((item) => {
          if (button.innerText == "Active") {
            console.log("true");
          }
        });
      });
    });
  }
});

function updateChecklist() {
  const checkbox = document.querySelectorAll(".cross-checklist");
  checkbox.forEach((item) => {
    item.addEventListener("change", () => {
      checkedItems = Array.from(checkbox).filter((item) => item.checked);
      itemsLeft.innerHTML = `${
        ulContainer.childElementCount - checkedItems.length - 1
      } items left`;
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
