import html2canvas from "html2canvas";


export function ShareButton() {
    return (
        <button
            className="button"
            onClick={() => shareResults()}
        >
            Copiar para enviar
        </button>
    );
}


async function shareResults() {
    const section = document.querySelector('#sharable-results');
    const clone = section.cloneNode(true);
    const buttons = clone.querySelector('.btn-actions');
    if (buttons) buttons.remove();

    // Padding in all directions (top, right, bottom, left)
    const padding = "25px";

    // Create wrapper with uniform padding and gradient background
    const wrapper = document.createElement("div");
    wrapper.className = "screenshot-wrapper";
    
    // Create form-section div
    const formSection = document.createElement("div");
    formSection.className = "form-section";
    
    // Append content to form-section, then form-section to wrapper
    formSection.appendChild(clone);
    wrapper.appendChild(formSection);
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
        alert(error);
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
