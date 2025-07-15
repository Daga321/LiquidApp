import { useStateContext } from "./Utils/StateContext.jsx";

import { Header } from './components/Header/Header.jsx';
import { Stepper } from './components/Steeper/Stepper.jsx';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner.jsx';

// import { GeneralData } from './containers/GeneralData/GeneralData.jsx'
// import { Properties } from './containers/Properties/Properties.jsx'
// import { Adjustment } from './containers/Adjustment/Adjustment.jsx'
// import { Results } from './containers/Results/Results.jsx';

const views = [
    // <GeneralData />,
    // <Properties />, 
    // <Adjustment />,
    // <Results />
]

// Create the main App component
export function App() {
    const { data } = useStateContext();
    return (
        <div >
            <Header />
            <Stepper step={data.currentStep}/>
            <div className="form-section" id="app">
                {getView(data.currentStep)}
            </div>
        </div>
    );
}

function getView(step) {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (step > views.length - 1 || step < 0) {
        return (
            <div className="invalid-step-message">
            Etapa no válida. Por favor, selecciona una etapa correcta.
            </div>
        );
    }
    return views[step];
}



