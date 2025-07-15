/**
 * ErrorMessage Component
 * Reusable component for displaying validation error messages
 */
export function ErrorMessage({ error }) {
    if (!error) {
        return null;
    }
    
    return <div className="error-message">{error}</div>;
}
