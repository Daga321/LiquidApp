import { nextStep } from "../../App";

export function NextButton({ fuction, disabled = false }) {
    const handleClick = () => {
        if (disabled) return;
        
        if (fuction && typeof fuction === 'function') {
            fuction();
        } else {
            nextStep();
        }
    };

    return (
        <button
            className={`button ${disabled ? 'disabled' : ''}`}
            disabled={disabled}
            onClick={handleClick}
        >
            Siguiente
        </button>
    );
}