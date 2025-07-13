import { Header } from './components/Header/Header.jsx';
import { Stepper } from './components/Steeper/Stepper.jsx';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner.jsx';

import { GeneralData } from './containers/GeneralData/GeneralData.jsx'
// import { Properties } from './containers/Properties/Properties.jsx'
// import { Adjustment } from './containers/Adjustment/Adjustment.jsx'
// import { Results } from './containers/Results/Results.jsx';

// Create the main App component
export function App() {
    return (
        <div >
            <Header />
            <Stepper />
            <div className="form-section" id="app">
                <LoadingSpinner />
                <GeneralData />
                {/* <LoadingSpinner />
                <Properties /> 
                <LoadingSpinner />
                <Adjustment />
                <LoadingSpinner />
                <Results />  */}
            </div>
        </div>
    );
}


