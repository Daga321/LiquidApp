/**
 * Example usage of JSX components
 * This shows how to use the refactored components
 */

// Import components
import { Header } from './components/Header/Header.js';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner.js';
import { GeneralDataForm } from './components/GeneralDataForm/GeneralDataForm.js';
import { PropertiesForm } from './components/PropertiesForm/PropertiesForm.js';
import { AdjustmentForm } from './components/AdjustmentForm/AdjustmentForm.js';
import { Results } from './components/Results/Results.js';
import { Stepper } from './components/Steeper/Stepper.js';
import { DinamicTable } from './components/DinamicTable/DinamicTable.js';

// Usage examples:

// 1. Header component
function renderHeader() {
    return <Header />;
}

// 2. Loading spinner with custom message
function renderLoadingSpinner(message) {
    return <LoadingSpinner message={message} />;
}

// 3. Forms
function renderGeneralDataForm() {
    return <GeneralDataForm />;
}

function renderPropertiesForm() {
    return <PropertiesForm />;
}

function renderAdjustmentForm() {
    return <AdjustmentForm />;
}

function renderResults() {
    return <Results />;
}

// 4. Stepper navigation
function renderStepper() {
    return <Stepper />;
}

// 5. Dynamic table with data
function renderDynamicTable() {
    const tableData = {
        headers: ['Nombre', 'Valor', 'Acciones'],
        rows: [
            ['Propiedad 1', '$100', 'Editar'],
            ['Propiedad 2', '$200', 'Editar']
        ],
        tableId: 'example-table'
    };
    
    return <DinamicTable {...tableData} />;
}

// 6. Complete app structure
function App() {
    return (
        <div className="app">
            <Header />
            <Stepper />
            <div className="content">
                <GeneralDataForm />
                {/* Other forms would be shown conditionally */}
            </div>
        </div>
    );
}

export default App;
