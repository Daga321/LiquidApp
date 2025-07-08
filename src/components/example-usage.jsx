/**
 * Example usage of JSX components
 * This shows how to use the refactored components
 */

// Import components
import { Header } from './Header/Header.jsx';
import { LoadingSpinner } from './LoadingSpinner/LoadingSpinner.jsx';
import { GeneralDataForm } from './GeneralDataForm/GeneralDataForm.jsx';
import { PropertiesForm } from './PropertiesForm/PropertiesForm.jsx';
import { AdjustmentForm } from './AdjustmentForm/AdjustmentForm.jsx';
import { Results } from './Results/Results.jsx';
import { Stepper } from './Steeper/Stepper.jsx';
import { DinamicTable } from './DinamicTable/DinamicTable.jsx';

// Usage examples:

// 1. Header component
export function RenderHeader() {
    return <Header />;
}

// 2. Loading spinner with custom message
export function RenderLoadingSpinner(message) {
    return <LoadingSpinner message={message} />;
}

// 3. Forms
export function RenderGeneralDataForm() {
    return <GeneralDataForm />;
}

export function RenderPropertiesForm() {
    return <PropertiesForm />;
}

export function RenderAdjustmentForm() {
    return <AdjustmentForm />;
}

export function RenderResults() {
    return <Results />;
}

// 4. Stepper navigation
export function RenderStepper() {
    return <Stepper />;
}

// 5. Dynamic table with data
export function RenderDynamicTable() {
    const tableData = {
        headers: ['Nombre', 'Valor', 'Acciones'],
        rows: [
            ['Propiedad 1', '$100', 'Editar'],
            ['Propiedad 2', '$200', 'Editar']
        ],
        tableId: 'example-table'
    };
    
    return (<DinamicTable {...tableData} />);
}

// 6. Complete app structure
export function RenderApp() {
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