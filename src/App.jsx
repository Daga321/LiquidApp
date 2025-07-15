import { useStateContext } from "./Utils/StateContext.jsx";

import { Header } from './components/Header/Header.jsx';
import { Stepper } from './components/Steeper/Stepper.jsx';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner.jsx';

import { GeneralData } from './containers/GeneralData/GeneralData.jsx'
import { Properties } from './containers/Properties/Properties.jsx'
// import { Adjustment } from './containers/Adjustment/Adjustment.jsx'
// import { Results } from './containers/Results/Results.jsx';

// Module variable to handle current step and setter for external access
let currentStepRef = { value: 0, setter: null }; 

const views = {
    "Datos generales": <GeneralData />,
    "Propiedades": <Properties />,
    // "Ajustes": <Adjustment />,
    // "Resultados": <Results />
}

function getView(currentStep) {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
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
    const { data } = useStateContext();
    const [currentStep, setCurrentStep] = React.useState(0);
    
    // Update module reference when component mounts or state changes
    React.useEffect(() => {
        currentStepRef.value = currentStep;
        currentStepRef.setter = setCurrentStep;
    }, [currentStep]);
    
    return (
        <div >
            <Header />
            <Stepper step={currentStep} views={Object.keys(views)} />
            <div className="form-section" id="app">
                {getView(currentStep)}
            </div>
        </div>
    );
}

export function nextStep(){
    if (currentStepRef.setter) {
        const newStep = currentStepRef.value + 1;
        const maxStep = Object.keys(views).length - 1;
        currentStepRef.setter(newStep > maxStep ? maxStep : newStep);
    }
}

export function prevStep() {
    if (currentStepRef.setter) {
        const newStep = currentStepRef.value - 1;
        currentStepRef.setter(newStep < 0 ? 0 : newStep);
    }
}

