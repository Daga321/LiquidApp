import React from "react";
import { prevStep } from "../../App";

export function BackButton() {
    return (
        <button
            className="button"
            onClick={() => prevStep()}
        >
            Atrás
        </button>
    );
}
