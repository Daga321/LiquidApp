import { nextStep } from "../../Main";

export function NextButton({ fuction }) {
    return (
        <button
            className="button"
            disabled={fuction()}
            onClick={() => nextStep()}
        >
            Siguiente
        </button>
    );
}