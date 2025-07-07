/**
 * LoadingSpinner Component
 * Renders a loading spinner with message
 */
export function LoadingSpinner({ message = 'Cargando...' }) {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <span>{message}</span>
        </div>
    );
}
