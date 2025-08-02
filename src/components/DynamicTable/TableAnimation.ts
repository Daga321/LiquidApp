import { TableAnimationOptions, AnimationDirection } from "../../Types/Componets/DynamicTableTypes";

export function updateActions({ tableSelector, onMove, onDelete }: TableAnimationOptions): void {
    const rows = document.querySelectorAll(`${tableSelector} tbody tr`);

    rows.forEach((row, index) => {
        const cell = row.querySelector(".table-actions") as HTMLElement;
        if (!cell) return;
        
        cell.innerHTML = "";

        const currentProperty = row.getAttribute("data-property-index");
        const prevRow = rows[index - 1] as HTMLElement | undefined;
        const nextRow = rows[index + 1] as HTMLElement | undefined;

        const isFirst = index === 0;
        const isLast = index === rows.length - 1;
        
        const canMoveUp = !isFirst && prevRow?.getAttribute("data-property-index") === currentProperty;
        const canMoveDown = !isLast && nextRow?.getAttribute("data-property-index") === currentProperty;

        // Add move up button only if not first
        if (canMoveUp) {
            const upButton = createMoveUpButton(row as HTMLElement, index, onMove);
            // Si solo puede moverse hacia arriba, que ocupe más espacio
            if (!canMoveDown) {
                upButton.classList.add("wide-button");
            }
            cell.appendChild(upButton);
        }

        // Add move down button only if not last
        if (canMoveDown) {
            const downButton = createMoveDownButton(row as HTMLElement, index, onMove);
            // Si solo puede moverse hacia abajo, que ocupe más espacio
            if (!canMoveUp) {
                downButton.classList.add("wide-button");
            }
            cell.appendChild(downButton);
        }

        // Always add delete button
        cell.appendChild(createDeleteButton(row as HTMLElement, index, onDelete));
    });
}


function createMoveUpButton(row: HTMLElement, index: number, onMove: (fromIndex: number, toIndex: number) => void): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "button action-button";
    btn.textContent = "↑";
    btn.title = "Mover arriba";
    btn.onclick = () => {
        const prev = row.previousElementSibling as HTMLElement;
        if (!prev) return;

        animateRowSwap(row, prev, "up", () => {
            onMove(index, index - 1);
        });
    };
    return btn;
}

function createMoveDownButton(row: HTMLElement, index: number, onMove: (fromIndex: number, toIndex: number) => void): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "button action-button";
    btn.textContent = "↓";
    btn.title = "Mover abajo";
    btn.onclick = () => {
        const next = row.nextElementSibling as HTMLElement;
        if (!next) return;

        animateRowSwap(row, next, "down", () => {
            onMove(index, index + 1);
        });
    };
    return btn;
}

function createDeleteButton(row: HTMLElement, index: number, onDelete: (index: number) => void): HTMLButtonElement {
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

function animateRowSwap(row1: HTMLElement, row2: HTMLElement, direction: AnimationDirection, callback: () => void): void {
    row1.classList.add("moving", `to-${direction}`);
    row2.classList.add("moving", `from-${direction}`);

    setTimeout(() => {
        row1.classList.remove("moving", `to-${direction}`);
        row2.classList.remove("moving", `from-${direction}`);
        callback();
    }, 1000);
}

function removeRowWithEffect(row: HTMLElement, callback: () => void): void {
    row.classList.add("removing-zoom");

    setTimeout(() => {
        row.classList.remove("removing-zoom");
        // Don't remove the row from DOM - let React handle it
        // row.remove();
        callback();
    }, 600);
}