import { Header } from './components/Header/Header.jsx';
import { Stepper } from './components/Steeper/Stepper.jsx';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner.jsx';

// Create the main App component
export function App() {
    return (
        <div >
            <Header />
            <Stepper />
            <div className="form-section" id="app">
                <LoadingSpinner />
            </div>
        </div>
    );
}

