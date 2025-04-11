function setPropertySelectData() {
    const selectProperty = document.getElementById("property-select");
    selectProperty.innerHTML = ""; // Clear
    manager.properties.forEach((property, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = property.name;
        selectProperty.appendChild(option);
    });
    const option = document.createElement("option");
    option.value = "all";
    option.textContent = "Todos";
    selectProperty.appendChild(option);
}

function renderAdjustments(index) {
    const tableBody = document.querySelector("#adjustments-table tbody");
    const adjustmentTablePropertyName = document.getElementById("adjustmentTablePropertyName");
    tableBody.innerHTML = "";

    let combinedAdjustments = [];

    if (index === manager.properties.length) {
        adjustmentTablePropertyName.classList.remove("hidden");

        // Agrupar todos los ajustes de todas las propiedades
        manager.properties.forEach((property, i) => {
            const adjustments = property.adjustmentsList || [];
            adjustments.forEach((adjustment, j) => {
                combinedAdjustments.push({
                    propertyIndex: i,
                    propertyName: property.name,
                    adjustmentIndex: j,
                    adjustment: adjustment
                });
            });
        });

        if (combinedAdjustments.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td colspan="4">No se han registrado ajustes en ninguna propiedad.</td>
            `;
            tableBody.appendChild(row);
            return;
        }

        // Agrupar por propiedad para aplicar rowspan
        const grouped = new Map();
        combinedAdjustments.forEach(({ propertyIndex, propertyName, adjustment, adjustmentIndex }) => {
            if (!grouped.has(propertyIndex)) {
                grouped.set(propertyIndex, {
                    propertyName,
                    adjustments: []
                });
            }
            grouped.get(propertyIndex).adjustments.push({
                adjustment,
                adjustmentIndex
            });
        });

        // Renderizar con rowspan por propiedad
        [...grouped.entries()].forEach(([propertyIndex, { propertyName, adjustments }]) => {
            adjustments.forEach((item, i) => {
                const { adjustment, adjustmentIndex } = item;
                const row = document.createElement("tr");
                row.setAttribute("data-property-index", propertyIndex);

                const typeClass = adjustment.type.Key === AdjustmentTypeEnum.DISCOUNT.Key
                    ? "discount-value"
                    : "extra-charge-value";

                row.innerHTML = `
                    ${i === 0 ? `<td rowspan="${adjustments.length}">${propertyName}</td>` : ""}
                    <td>${adjustment.note}</td>
                    <td class="${typeClass}">$${adjustment.value}</td>
                    <td class="table-actions"></td>
                `;

                tableBody.appendChild(row);
            });
        });

        // Limitar acciones a los ajustes de la misma propiedad
        updateActions({
            tableSelector: "#adjustments-table",
            onMove: (from, to) => {
                const fromItem = combinedAdjustments[from];
                const toItem = combinedAdjustments[to];

                // Solo permitir mover dentro del mismo grupo de propiedad
                if (fromItem.propertyIndex !== toItem.propertyIndex) return;

                const list = manager.properties[fromItem.propertyIndex].adjustmentsList;
                manager.array_move(list, fromItem.adjustmentIndex, toItem.adjustmentIndex);
                renderAdjustments(index);
            },
            onDelete: (indexToDelete) => {
                const { propertyIndex, adjustmentIndex } = combinedAdjustments[indexToDelete];
                manager.properties[propertyIndex].adjustmentsList.splice(adjustmentIndex, 1);
                renderAdjustments(index);
            }
        });

        return;
    } else {
        // Solo ajustes para una propiedad individual
        adjustmentTablePropertyName.classList.add("hidden");

        const property = manager.properties[index];
        const adjustments = property.adjustmentsList || [];

        if (adjustments.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td colspan="3">No se han registrado ajustes para esta propiedad.</td>
            `;
            tableBody.appendChild(row);
            return;
        }

        adjustments.forEach((adjustment, i) => {
            const row = document.createElement("tr");
            row.setAttribute("data-property-index", index);
            const typeClass = adjustment.type.Key === AdjustmentTypeEnum.DISCOUNT.Key
                ? "discount-value"
                : "extra-charge-value";

            row.innerHTML = `
                <td>${adjustment.note}</td>
                <td class="${typeClass}">$${adjustment.value}</td>
                <td class="table-actions"></td>
            `;

            tableBody.appendChild(row);
        });

        updateActions({
            tableSelector: "#adjustments-table",
            onMove: (from, to) => {
                manager.array_move(property.adjustmentsList, from, to);
                renderAdjustments(index);
            },
            onDelete: (indexToDelete) => {
                property.adjustmentsList.splice(indexToDelete, 1);
                renderAdjustments(index);
            }
        });
    }
}
