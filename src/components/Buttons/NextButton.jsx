import { nextStep } from "../../App";

export function NextButton({ disabled = false }) {
    const handleClick = () => {
        if (disabled) return;
        nextStep();
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