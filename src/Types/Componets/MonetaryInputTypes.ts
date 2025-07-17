import { InputHTMLAttributes } from 'react';

export interface MonetaryInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
    id?: string;
    value?: number;
    onChange?: (value: number) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    min?: number;
}
