/**
 * Props interface for Message component
 */
export interface IMessageProps {
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
}
