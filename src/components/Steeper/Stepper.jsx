import './Stepper.css'; // Import the stepper styles

/**
 * Stepper Component
 * Renders the step navigation for the form process
 */
export function Stepper() {
    return (
        <div className="stepper">
            <div className="step active" data-step="0" data-step-num="1">
                1. Datos generales
            </div>
            <div className="step" data-step="1" data-step-num="2">
                2. Propiedades
            </div>
            <div className="step" data-step="2" data-step-num="3">
                3. Extras
            </div>
            <div className="step" data-step="3" data-step-num="4">
                4. Resultado
            </div>
        </div>
    );
}
