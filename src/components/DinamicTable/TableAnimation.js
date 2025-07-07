function updateActions({ tableSelector, onMove, onDelete }) {
    const rows = document.querySelectorAll(`${tableSelector} tbody tr`);

    rows.forEach((row, index) => {
        const cell = row.querySelector(".table-actions");
        cell.innerHTML = "";

        const currentProperty = row.getAttribute("data-property-index");
        const prevRow = rows[index - 1];
        const nextRow = rows[index + 1];

        if (index > 0 && prevRow?.getAttribute("data-property-index") === currentProperty) {
            cell.appendChild(createMoveUpButton(row, index, onMove));
        }

        if (index < rows.length - 1 && nextRow?.getAttribute("data-property-index") === currentProperty) {
            cell.appendChild(createMoveDownButton(row, index, onMove));
        }

        cell.appendChild(createDeleteButton(row, index, onDelete));
    });
}


function createMoveUpButton(row, index, onMove) {
    const btn = document.createElement("button");
    btn.className = "button action-button";
    btn.textContent = "↑";
    btn.title = "Mover arriba";
    btn.onclick = () => {
        const prev = row.previousElementSibling;
        if (!prev) return;

        animateRowSwap(row, prev, "up", () => {
            onMove(index, index - 1);
        });
    };
    return btn;
}

function createMoveDownButton(row, index, onMove) {
    const btn = document.createElement("button");
    btn.className = "button action-button";
    btn.textContent = "↓";
    btn.title = "Mover abajo";
    btn.onclick = () => {
        const next = row.nextElementSibling;
        if (!next) return;

        animateRowSwap(row, next, "down", () => {
            onMove(index, index + 1);
        });
    };
    return btn;
}

function createDeleteButton(row, index, onDelete) {
    const btn = document.createElement("button");
    btn.innerHTML = "🗑️";
    btn.classList.add("delete-btn");
    btn.onclick = () => {
        removeRowWithEffect(row, () => {
            onDelete(index);
        });
    };
    return btn;
}

function animateRowSwap(row1, row2, direction, callback) {
    row1.classList.add("moving", `to-${direction}`);
    row2.classList.add("moving", `from-${direction}`);

    setTimeout(() => {
        row1.classList.remove("moving", `to-${direction}`);
        row2.classList.remove("moving", `from-${direction}`);
        callback();
    }, 1000);
}

function removeRowWithEffect(row, callback) {
    row.classList.add("removing-zoom");

    setTimeout(() => {
        row.remove();
        callback();
    }, 600);
}