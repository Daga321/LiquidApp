import { nextStep } from "../../App";

export function NextButton({ disabled = false }: { disabled?: boolean }) {
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
