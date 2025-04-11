function loadResultSection() {
    renderHeaders();
    renderProperties();
}

function renderHeaders() {
    document.getElementById("service-name-information").textContent = manager.serviceName

    const urgentCell = document.getElementById("urgent-payment");

    const dateFormat = new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const today = new Date();
    document.getElementById("liquidationDateLabel").textContent = `Fecha de liquidación: ${dateFormat.format(today)}`
    const dueValue = document.getElementById("due-date").value;
    const due = dueValue ? new Date(dueValue) : new Date();
    document.getElementById("dueDateLabel").textContent = `Fecha límite de pago: ${dateFormat.format(due)}`
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        urgentCell.textContent = "PAGO URGENTE";
    } else {
        urgentCell.textContent = `Faltan ${diffDays} día(s) para el vencimiento`;
    }

    const costLabel = document.getElementById("unit-cost-information");
    const isMultipleMeter = document.getElementById("multiple-meter").checked
    if(isMultipleMeter){
        costLabel.textContent = `Valor por ${document.getElementById("unit").value}: $${document.getElementById("service-amount").value}`;
    }else if(manager.valuePerPeope>0){
        costLabel.textContent = `Valor por persona: $${manager.valuePerPeope.toFixed(2)}`;
    }
}

function renderProperties() {
    const tbody = document.getElementById("properties-table-body");
    tbody.innerHTML = ""; // Limpiar

    properties = manager.properties;

    properties.forEach(property => {

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${property.name}</td>
            <td>${property.method.Method}</td>
            <td>${property.baseValue}</td>
            <td class="${property.amountToPay>0 ? "extra-charge-value" : (property.amountToPay<0 ? "discount-value" : "")}">$${property.amountToPay.toFixed(2)}</td>
            <td class="${property.adjustmentValue>0 ? "extra-charge-value" : (property.adjustmentValue<0 ? "discount-value" : "")}">$${property.adjustmentValue.toFixed(2)}</td>
            <td class="${property.totalToPay>0 ? "extra-charge-value" : (property.totalToPay<0 ? "discount-value" : "")}">$${property.totalToPay.toFixed(2)}</td>
        `;
        tbody.appendChild(row);

        // Display adjustman if exist
        if (property.adjustmentsList?.length > 0) {
            const adjustmentDiv = document.createElement("div");
            adjustmentDiv.classList.add("adjustments-container");

            const ul = document.createElement("ul");

            property.adjustmentsList.forEach(adj => {
                const li = document.createElement("li");

                li.innerHTML = `
                    <span class="adjustment-text">${adj.note}</span>
                    <span class="adjustment-value ${adj.type === AdjustmentTypeEnum.DISCOUNT ? "discount-value" : "extra-charge-value"}">
                        $${adj.type === AdjustmentTypeEnum.DISCOUNT ? "-" : "+"}${adj.value}
                    </span>
                `;

                ul.appendChild(li);
            });

            const totalLi = document.createElement("li");
            totalLi.innerHTML = `
                <span class="adjustment-text"><strong>Total:</strong></span>
                <span class="adjustment-value ${property.adjustmentValue>0 ? "extra-charge-value" : (property.adjustmentValue<0 ? "discount-value" : "")}">
                    $${property.adjustmentValue>0 ? "+" : ""}${property.adjustmentValue}
                </span>
            `;
            ul.appendChild(totalLi);

            adjustmentDiv.appendChild(ul);

            // Insert adjustment div after property row
            const adjustmentContainerRow = document.createElement("tr");
            const adjustmentCell = document.createElement("td");
            adjustmentCell.colSpan = 6;
            adjustmentCell.appendChild(adjustmentDiv);
            adjustmentContainerRow.appendChild(adjustmentCell);
            tbody.appendChild(adjustmentContainerRow);
        }
    });
}

async function shareResults() {
    const section = document.querySelector('section[data-section="4"]');
    const clone = section.cloneNode(true);
    const buttons = clone.querySelector('.btn-actions');
    if (buttons) buttons.remove();

    // Padding in all directions (top, right, bottom, left)
    const padding = "25px";

    // Create wrapper with uniform padding and gradient background
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "-9999px";
    wrapper.style.left = "0";
    wrapper.style.width = "fit-content";
    wrapper.style.padding = padding;
    wrapper.style.background = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-main').trim();
    wrapper.style.display = "inline-block";
    wrapper.style.boxSizing = "border-box";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Ensure content inside result tables overflows properly
    clone.querySelectorAll(".resulTableWraper").forEach(wrapper => {
        wrapper.style.overflow = "visible";
    });

    try {
        const canvas = await html2canvas(wrapper, {
            scale: 2,
            useCORS: true
        });

        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob })
                ]);
                showToast("📸 Captura copiada al portapapeles. Pégala en WhatsApp, correo o cualquier app de mensajería.");
            } catch (err) {
                showToast("❌ No se pudo copiar. Usa un navegador moderno.");
                console.error(err);
            }
        });
    } catch (error) {
        console.error("Error capturing section:", error);
        showToast("⚠️ Error al capturar la sección.");
    } finally {
        document.body.removeChild(wrapper);
    }
}

function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400); // Wait for animation
    }, duration);
}

