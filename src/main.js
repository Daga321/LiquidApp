// These stylesheets are essential for the base layout and should be loaded in the index to prevent layout shifts.
// import './css/Style.css'
// import './css/Variables.css'

import './css/TableAnimations.css'
import './css/Toast.css'
import './css/Table.css';
import './css/Adjustments.css';
import './css/FormElements.css';


import './js/objects/Adjustment.js'
import './js/objects/AdjustmentTypeEnum.js'
import './js/objects/LiquidationMethodEnum.js'
import './js/objects/Property.js'
import './js/AdjustmentForm.js'
import './js/GeneralData.js'
import './js/Manager.js'
import './js/PropertiesForm.js'
import './js/Results.js'
import './js/Stepper.js'
import './js/TableAnimation.js'
// import './js/Validation.js'

const formSteps = [
    './src/html/GeneralDataForm.html',
    './src/html/PropertiesForm.html',
    './src/html/AdjustmensForm.html',
    './src/html/ResultsForm.html'
];
let currentStep = 0;

// Dynamically load an HTML file into #app
async function loadHtmlIntoApp(path) {
    const response = await fetch(path);
    const html = await response.text();
    document.getElementById('app').innerHTML = html;
    updateStepperUI();
    attachNavHandlers();
}

function goToStep(step) {
    if (step < 0 || step >= formSteps.length) return;
    currentStep = step;
    loadHtmlIntoApp(formSteps[step]);
}

function nextStep() {
    if (currentStep < formSteps.length - 1) {
        goToStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 0) {
        goToStep(currentStep - 1);
    }
}

function updateStepperUI() {
    const steps = document.querySelectorAll('.stepper .step');
    steps.forEach((el, idx) => {
        el.classList.toggle('active', idx === currentStep);
    });
}

function attachNavHandlers() {
    // Attach next/prev handlers to buttons if present
    const nextBtn = document.querySelector('.button[id$="NextButton"], .button.next-step');
    if (nextBtn) nextBtn.onclick = nextStep;
    const prevBtn = document.querySelector('.button[id$="PrevButton"], .button.prev-step');
    if (prevBtn) prevBtn.onclick = prevStep;
}

// Expose navigation functions for inline HTML handlers
window.nextStep = nextStep;
window.prevStep = prevStep;

goToStep(0);


