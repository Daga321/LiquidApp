import './Stepper.css'; // Import the stepper styles

/**
 * Stepper Component
 * Renders the step navigation for the form process
 */
export function Stepper({ step }) {
    return (
        <div className="stepper">
            <div className={`step ${step === 0 ? "active" : ""}`}>
                1. Datos generales
            </div>
            <div className={`step ${step === 1 ? "active" : ""}`}>
                2. Propiedades
            </div>
            <div className={`step ${step === 2 ? "active" : ""}`}>
                3. Extras
            </div>
            <div className={`step ${step === 3 ? "active" : ""}`}>
                4. Resultado
            </div>
        </div>
    );
}
