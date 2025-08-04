import './Stepper.css'; // Import the stepper styles
import { StepperProps } from "../../../Types/components/StepperTypes";

/**
 * Stepper Component
 * Renders the step navigation for the form process
 */
export function Stepper({ step, views }: StepperProps) {
    return (
        <div className="stepper">
            {views.map((view, index) => (
                <div key={index} className={`step ${step === index ? "active" : ""}`}>
                    {index + 1}. {view}
                </div>
            ))}
        </div>
    );
}
