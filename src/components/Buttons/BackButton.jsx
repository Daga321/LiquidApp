import { prevStep } from "../../Main";

export function BackButton() {
    return (
        <button
            className="button"
            onClick={() => prevStep()}
        >
            Atras
        </button>
    );
}