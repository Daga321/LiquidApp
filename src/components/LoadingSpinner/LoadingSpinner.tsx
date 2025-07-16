import React from "react";
import './LoadingSpinner.css'; // Import the loading spinner styles

/**
 * LoadingSpinner Component
 * Renders a loading spinner with message
 */
export function LoadingSpinner({ message = 'Cargando...' }: { message?: string }) {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <span>{message}</span>
        </div>
    );
}
