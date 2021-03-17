const individualList = document.querySelectorAll('.individual-list');
const listContainer = document.getElementById('list-container');

individualList.forEach(list => {
    list.addEventListener('dragstart', () => {
        list.classList.add('dragging');
    });

    list.addEventListener('dragend', () => {
        list.classList.remove('dragging');
    });
});

listContainer.addEventListener('dragover', e => {
    e.preventDefault();

    const afterElement = getDragAfterElement(listContainer, e.clientY);
    const draggable = document.querySelector('.dragging');

    console.log(afterElement);
})


console.log()

function getDragAfterElement(container, y) {
    const draggableElements = [...listContainer.querySelectorAll('.individual-list:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }

    }, { offset: Number.POSITIVE_INFINITY}).element;
}
