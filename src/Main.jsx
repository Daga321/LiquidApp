// These stylesheets are essential for the base layout and should be loaded in the index to prevent layout shifts.
// import './css/Style.css'
// import './css/Variables.css'

import './components/DinamicTable/TableAnimations.css'
import './components/DinamicTable/Table.css';

import { StrictMode } from 'react';

import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import { StateProvider } from "./Utils/StateContext.jsx";

// Mount the app to the root element
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </StrictMode>
);

export function nextStep(){

}

export function validate(data) {
    return true;
}

export function prevStep() {
}
