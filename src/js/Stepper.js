var currentStep = 0;
const steps = document.querySelectorAll(".step");
const sections = document.querySelectorAll(".form-section");

function updateStepDisplay() {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === currentStep);
    });

    sections.forEach((section, i) => {
        section.classList.toggle("active", i === currentStep);
    });
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateStepDisplay();
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateStepDisplay();
    }
}