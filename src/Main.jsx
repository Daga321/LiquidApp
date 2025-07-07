// These stylesheets are essential for the base layout and should be loaded in the index to prevent layout shifts.
// import './css/Style.css'
// import './css/Variables.css'

import './components/DinamicTable/TableAnimations.css'
import './components/Results/Toast.css'
import './components/DinamicTable/Table.css';
import './components/AdjustmentForm/Adjustments.css';
import './css/FormElements.css';


// import './js/objects/Adjustment.js'
// import './js/objects/AdjustmentTypeEnum.js'
// import './js/objects/LiquidationMethodEnum.js'
// import './js/objects/Property.js'
// import './js/AdjustmentForm.js'
// import './js/GeneralData.js'
// import './js/Manager.js'
// import './js/PropertiesForm.js'
// import './js/Results.js'
// import './js/Stepper.js'
// import './js/TableAnimation.js'
// import './js/Validation.js'

// import './Router.js';


import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';

// Mount the app to the root element
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
