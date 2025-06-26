import './css/style.css'
import './css/variables.css'
import './css/TableAnimations.css'
import './css/Toast.css'


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
import './js/Validation.js'


// Cargar otro HTML dentro de #app usaremos GeneralData.html
fetch('./html/GeneralData.html')
  .then(res => res.text())
  .then(html => {
    document.querySelector('#app').innerHTML = html;
  });

