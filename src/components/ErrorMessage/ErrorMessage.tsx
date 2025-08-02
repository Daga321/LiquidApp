/**
 * ErrorMessage Component
 * Reusable component for displaying validation error messages
 */
export function ErrorMessage({ error }: { error?: string | null }) {
    if (!error) {
        return null;
    }
    
    return <div className="error-message">{error}</div>;
}
