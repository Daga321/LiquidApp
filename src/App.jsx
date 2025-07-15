import { useStateContext } from "./Utils/StateContext.jsx";

import { Header } from './components/Header/Header.jsx';
import { Stepper } from './components/Steeper/Stepper.jsx';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner.jsx';

import { GeneralData } from './containers/GeneralData/GeneralData.jsx'
// import { Properties } from './containers/Properties/Properties.jsx'
// import { Adjustment } from './containers/Adjustment/Adjustment.jsx'
// import { Results } from './containers/Results/Results.jsx';

let currentStep = 0; 

const views = {
    "Datos generales": <GeneralData />,
    // "Propiedades": <Properties />,
    // "Ajustes": <Adjustment />,
    // "Resultados": <Results />
}

function getView() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (currentStep > views.length - 1 || currentStep < 0) {
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
    return (
        <div >
            <Header />
            <Stepper step={currentStep} views={Object.keys(views)} />
            <div className="form-section" id="app">
                {getView()}
            </div>
        </div>
    );
}

export function nextStep(){
    currentStep++;
    if (currentStep > views.length - 1) {
        currentStep = 0;
    }
}

export function prevStep() {
    currentStep--;
    if (currentStep < 0) {
        currentStep = 0;
    }
}

