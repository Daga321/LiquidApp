import { useState, useEffect } from 'react';
import { MonetaryInputProps } from "../../../Types/components/MonetaryInputTypes";

/**
 * MonetaryInput Component
 * Real-time formatting input with $ symbol inside and automatic thousand separators
 */
export function MonetaryInput({
    id,
    value = 0,
    onChange,
    placeholder = "$0",
    className = "",
    disabled = false,
    min = 0,
    ...props
}: MonetaryInputProps) {
    const [displayValue, setDisplayValue] = useState('$0');

    // Format number to Colombian peso format with $ symbol
    const formatToDisplay = (num: number): string => {
        if (!num || num === 0) return '$0';
        
        const numValue = parseFloat(num.toString());
        if (isNaN(numValue)) return '$0';
        
        // Format with Colombian locale (. for thousands, , for decimals)
        const formatted = numValue.toLocaleString('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        
        return `$${formatted}`;
    };

    // Parse display value back to number (remove $ and format indicators)
    const parseFromDisplay = (str: string): number => {
        if (!str || str === '$' || str === '$0') return 0;
        
        // Remove $ symbol and any spaces
        let cleanStr = str.replace(/\$/g, '').trim();
        if (!cleanStr) return 0;
        
        // Handle Colombian format: periods for thousands, comma for decimal
        // Replace all periods except the last comma with empty string
        const lastComma = cleanStr.lastIndexOf(',');
        
        if (lastComma > -1) {
            // Has decimal part
            const integerPart = cleanStr.substring(0, lastComma).replace(/\./g, '');
            const decimalPart = cleanStr.substring(lastComma + 1);
            cleanStr = `${integerPart}.${decimalPart}`;
        } else {
            // No decimal part, just remove all periods
            cleanStr = cleanStr.replace(/\./g, '');
        }
        
        const numValue = parseFloat(cleanStr);
        return isNaN(numValue) ? 0 : numValue;
    };

    // Format input as user types
    const formatRealTime = (inputStr: string): string => {
        // Always ensure it starts with $
        if (!inputStr.startsWith('$')) {
            inputStr = '$' + inputStr.replace(/\$/g, '');
        }
        
        // Extract numeric part
        const numericPart = inputStr.replace(/\$/g, '');
        
        if (!numericPart || numericPart === '0' || numericPart === '') {
            return '$0';
        }
        
        // Check if user is typing decimal values (has comma)
        if (numericPart.includes(',')) {
            const parts = numericPart.split(',');
            if (parts.length === 2) {
                // Format only the integer part, keep decimal as is
                const integerPart = parts[0];
                const decimalPart = parts[1];
                
                // Only format integer part if it's not being actively edited
                if (integerPart.length > 3) {
                    const formattedInteger = parseInt(integerPart).toLocaleString('es-CO');
                    return `$${formattedInteger},${decimalPart}`;
                } else {
                    return `$${integerPart},${decimalPart}`;
                }
            }
        }
        
        // Parse the numeric value for full formatting
        const numValue = parseFromDisplay(inputStr);
        
        if (numValue === 0) {
            return '$0';
        }
        
        // Return formatted value only for whole numbers
        return formatToDisplay(numValue);
    };

    // Update display value when value prop changes
    useEffect(() => {
        setDisplayValue(formatToDisplay(value));
    }, [value]);

    // Handle input change with real-time formatting
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        
        // Prevent removing the $ symbol
        if (!inputValue.includes('$')) {
            inputValue = '$' + inputValue;
        }
        
        // Ensure $ is at the beginning
        if (inputValue.indexOf('$') > 0) {
            inputValue = '$' + inputValue.replace(/\$/g, '');
        }
        
        // Handle backspace on $0
        if (inputValue === '$' || inputValue === '') {
            inputValue = '$0';
        }
        
        // Extract the numeric part for processing
        const numericPart = inputValue.replace(/\$/g, '');
        
        // Check if user is currently typing decimal values
        const hasComma = numericPart.includes(',');
        const hasTrailingComma = numericPart.endsWith(',');
        
        if (hasTrailingComma) {
            // User just typed comma, keep it for decimal input
            setDisplayValue(inputValue);
            // Don't update parent value until user types decimal digits
        } else if (hasComma) {
            // User is typing decimal digits
            const parts = numericPart.split(',');
            if (parts.length === 2 && parts[1].length <= 2) {
                // Allow up to 2 decimal places while typing
                setDisplayValue(inputValue);
                // Parse and send numeric value to parent
                const numericValue = parseFromDisplay(inputValue);
                if (onChange) {
                    onChange(numericValue);
                }
            } else if (parts.length === 2 && parts[1].length > 2) {
                // Limit to 2 decimal places
                const limitedValue = `$${parts[0]},${parts[1].substring(0, 2)}`;
                setDisplayValue(limitedValue);
                // Parse and send numeric value to parent
                const numericValue = parseFromDisplay(limitedValue);
                if (onChange) {
                    onChange(numericValue);
                }
            } else {
                // More than one comma, format normally
                const formattedValue = formatRealTime(inputValue);
                setDisplayValue(formattedValue);
                // Parse and send numeric value to parent
                const numericValue = parseFromDisplay(formattedValue);
                if (onChange) {
                    onChange(numericValue);
                }
            }
        } else {
            // No decimal input, apply full formatting
            const formattedValue = formatRealTime(inputValue);
            setDisplayValue(formattedValue);
            // Parse and send numeric value to parent
            const numericValue = parseFromDisplay(formattedValue);
            if (onChange) {
                onChange(numericValue);
            }
        }
    };

    // Handle key down to prevent certain keys and manage cursor
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { key, target } = e;
        const inputTarget = target as HTMLInputElement;
        const { selectionStart, selectionEnd, value } = inputTarget;
        
        // Prevent deleting the $ symbol
        if ((key === 'Backspace' || key === 'Delete') && (selectionStart ?? 0) <= 1) {
            e.preventDefault();
            return;
        }
        
        // Handle comma input for decimals
        if (key === ',') {
            // Only allow one comma and only if there isn't one already
            if (value.includes(',')) {
                e.preventDefault();
                return;
            }
        }
        
        // Handle period as decimal separator (convert to comma)
        if (key === '.') {
            e.preventDefault();
            if (!value.includes(',')) {
                const start = selectionStart ?? 0;
                const end = selectionEnd ?? 0;
                // Insert comma instead of period
                const newValue = value.slice(0, start) + ',' + value.slice(end);
                inputTarget.value = newValue;
                inputTarget.setSelectionRange(start + 1, start + 1);
                // Trigger onChange manually
                const event = new Event('input', { bubbles: true });
                inputTarget.dispatchEvent(event);
            }
            return;
        }
        
        // Only allow digits, comma, backspace, delete, arrow keys, tab
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End', ','
        ];
        
        if (!allowedKeys.includes(key) && !/\d/.test(key)) {
            e.preventDefault();
        }
        
        // Limit decimal places to 2
        if (/\d/.test(key) && value.includes(',')) {
            const commaIndex = value.indexOf(',');
            const decimalPart = value.substring(commaIndex + 1);
            
            // If cursor is after comma and we already have 2 decimal digits
            if ((selectionStart ?? 0) > commaIndex && decimalPart.length >= 2) {
                e.preventDefault();
            }
        }
    };

    return (
        <input
            {...props}
            id={id}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
        />
    );
}
