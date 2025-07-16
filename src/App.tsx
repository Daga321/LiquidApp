import * as ReactModule from "react";

import { Header } from './components/Header/Header';
import { Stepper } from './components/Steeper/Stepper';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { CurrentStepRef, ViewsConfig } from './Types/Componets/StepperTypes';

import { GeneralData } from './containers/GeneralData/GeneralData';
import { Properties } from './containers/Properties/Properties';
// import { Adjustment } from './containers/Adjustment/Adjustment'
// import { Results } from './containers/Results/Results';

// Module variable to handle current step and setter for external access
let currentStepRef: CurrentStepRef = { value: 0, setter: null }; 

// Define the views type
const views: ViewsConfig = {
    "Datos generales": <GeneralData />,
    "Propiedades": <Properties />,
    // "Ajustes": <Adjustment />,
    // "Resultados": <Results />
}

function getView(currentStep: number) {
    const [loading, setLoading] = ReactModule.useState(true);

    ReactModule.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (currentStep > Object.keys(views).length - 1 || currentStep < 0) {
        return (
            <div className="invalid-step-message">
                Etapa no válida. Por favor, selecciona una etapa correcta.
            </div>
        );
    }
    const viewKeys = Object.keys(views);
    return views[viewKeys[currentStep]];
}

// Create the main App component
export function App() {
    const [currentStep, setCurrentStep] = ReactModule.useState(0);
    
    // Update module reference when component mounts or state changes
    ReactModule.useEffect(() => {
        currentStepRef.value = currentStep;
        currentStepRef.setter = setCurrentStep;
    }, [currentStep]);
    
    return (
        <div>
            <Header />
            <Stepper step={currentStep} views={Object.keys(views)} />
            <div className="form-section" id="app">
                {getView(currentStep)}
            </div>
        </div>
    );
}

export function nextStep(): void {
    if (currentStepRef.setter) {
        const newStep = currentStepRef.value + 1;
        const maxStep = Object.keys(views).length - 1;
        currentStepRef.setter(newStep > maxStep ? maxStep : newStep);
    }
}

export function prevStep(): void {
    if (currentStepRef.setter) {
        const newStep = currentStepRef.value - 1;
        currentStepRef.setter(newStep < 0 ? 0 : newStep);
    }
}
