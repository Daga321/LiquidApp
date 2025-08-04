import './Message.css';
import { IMessageProps } from "../../../Types/components/IMessageProps";

/**
 * Message Component
 * Displays informational, warning, error, or success messages to the user
 */
export function Message({ message, type = 'info' }: IMessageProps) {
    return (
        <div className={`message-box message-${type}`}>
            <p>{message}</p>
        </div>
    );
}
