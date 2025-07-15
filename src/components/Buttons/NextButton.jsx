import { nextStep } from "../../App";

export function NextButton({ disabled = false }) {
    const handleClick = () => {
        if (disabled) return;
        nextStep();
        console.log("Form is valid, proceeding to next step");
    };

    return (
        <button
            className='button'
            disabled={disabled}
            onClick={handleClick}
        >
            Siguiente
        </button>
    );
}