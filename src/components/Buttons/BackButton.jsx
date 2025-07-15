import { prevStep } from "../../App";

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