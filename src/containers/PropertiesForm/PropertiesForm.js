function renderPropertiesTable() {
    const tbody = document.querySelector("#properties-table tbody");
    tbody.innerHTML = ""; //clear the table

    manager.properties.forEach((property, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-index", index);
        row.setAttribute("data-input-type", property.method.Key);

        const inputCellHTML = getInputCellHTML(property, index);

        row.innerHTML = `
            <td>${property.name}</td>
            <td>${inputCellHTML}</td>
            <td class="table-actions"></td>
        `;

        tbody.appendChild(row);
    });

    tbody.querySelectorAll(".property-input").forEach(input => {
        input.addEventListener("input", event => {
            const idx = parseInt(input.name.split("-")[1], 10);
            const value = input.value;
            if (manager.properties[idx]) {
                manager.properties[idx].baseValue = parseFloat(value) || 0;
            }
        });
    });

    // dinamically setup the actions button of each row
    updateActions({
        tableSelector: "#properties-table",
        onMove: (from, to) => {
            manager.array_move(manager.properties, from, to);
            renderPropertiesTable();
            validatePropertiesForm()
        },
        onDelete: (index) => {
            manager.properties.splice(index, 1);
            renderPropertiesTable();
            validatePropertiesForm()
        }
    });
}


function getInputCellHTML(property, index) {
    const value = property.baseValue!=0 ? property.baseValue : ''
    let input = `<input class="property-input" name="input-${index}" type="number" min="1" `
    switch (property.method) {
        case LiquidationMethodEnum.CONSUMPTION:
            input += `step="0.01" `
            break;
        case LiquidationMethodEnum.PERCENTAGE:
             input += `max="100" step="1" `
             break;
        case LiquidationMethodEnum.PEOPLE:
           input += `step="1" `
           break;
    }
    input += `placeholder="${property.method.InputPlaceHolder}" value="${value}">`
    return input
}

