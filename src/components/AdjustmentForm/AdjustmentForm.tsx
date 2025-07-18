import { useState } from "react";
import { AdjustmentTypeEnum } from "../../Models/Enums/AdjustmentTypeEnum.js";
import { IAdjustment } from "../../Types/Models/Adjustment.js";
import { IAdjustmentFormProps } from "../../Types/Componets/IAdjustmentFormProps.js";
import { AdjustmentValidation } from "../../Validation/AdjustmentValidation.js";
import { MonetaryInput } from "../MonetaryInput/MonetaryInput.tsx";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage.tsx";
import './Adjustments.css';

/**
 * AdjustmentForm Component
 * Renders the form for adjustments input
 */
export function AdjustmentForm({ onAddAdjustment, existingAdjustments = [] }: IAdjustmentFormProps) {
    const [adjustmentNote, setAdjustmentNote] = useState("");
    const [adjustmentValue, setAdjustmentValue] = useState(0);
    const [adjustmentType, setAdjustmentType] = useState("");
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    
    const validator = new AdjustmentValidation();

    // Validation functions
    const validateAdjustmentNote = (note: string) => {
        const result = validator.validateAdjustmentName(note);
        if (result.isValid) {
            // Check for duplicates
            const duplicateResult = validator.validateUniqueAdjustmentName(note, existingAdjustments);
            if (!duplicateResult.isValid) {
                setValidationErrors(prev => ({
                    ...prev,
                    adjustmentName: duplicateResult.errors.adjustmentName || ""
                }));
                return false;
            }
        }
        setValidationErrors(prev => ({
            ...prev,
            adjustmentName: result.errors.adjustmentName || ""
        }));
        return result.isValid;
    };

    const validateAdjustmentValue = (value: number) => {
        const result = validator.validateAdjustmentAmount(value);
        setValidationErrors(prev => ({
            ...prev,
            adjustmentAmount: result.errors.adjustmentAmount || ""
        }));
        return result.isValid;
    };

    const validateAdjustmentType = (type: string) => {
        const result = validator.validateAdjustmentType(type);
        setValidationErrors(prev => ({
            ...prev,
            adjustmentType: result.errors.adjustmentType || ""
        }));
        return result.isValid;
    };

    const handleAddAdjustment = () => {
        // Perform complete validation
        const validationResult = validator.validateAddAdjustment({
            adjustmentName: adjustmentNote,
            adjustmentAmount: adjustmentValue,
            adjustmentType: adjustmentType
        });

        setValidationErrors(validationResult.errors);

        if (!validationResult.isValid) {
            return;
        }

        const typeEnum = adjustmentType === AdjustmentTypeEnum.DISCOUNT.Key 
            ? AdjustmentTypeEnum.DISCOUNT 
            : AdjustmentTypeEnum.EXTRA_CHARGE;

        const adjustment: IAdjustment = {
            note: adjustmentNote,
            value: adjustmentValue,
            type: typeEnum
        };

        onAddAdjustment(adjustment);

        // Reset form
        setAdjustmentNote("");
        setAdjustmentValue(0);
        setAdjustmentType("");
        setValidationErrors({});
    };

    // Handle input changes with validation
    const handleAdjustmentNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAdjustmentNote(value);
        
        // Clear error when user starts typing
        if (validationErrors.adjustmentName) {
            setValidationErrors(prev => ({
                ...prev,
                adjustmentName: ""
            }));
        }
    };

    const handleAdjustmentValueChange = (value: number) => {
        setAdjustmentValue(value);
        
        // Clear error when user starts typing
        if (validationErrors.adjustmentAmount) {
            setValidationErrors(prev => ({
                ...prev,
                adjustmentAmount: ""
            }));
        }
    };

    const handleAdjustmentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAdjustmentType(value);
        
        // Clear error when user selects a type
        if (validationErrors.adjustmentType) {
            setValidationErrors(prev => ({
                ...prev,
                adjustmentType: ""
            }));
        }
    };

    // Handle blur events for validation
    const handleAdjustmentNoteBlur = () => {
        validateAdjustmentNote(adjustmentNote);
    };

    const handleAdjustmentValueBlur = () => {
        validateAdjustmentValue(adjustmentValue);
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor="adjustment-name">Concepto</label>
                <input 
                    type="text" 
                    id="adjustment-name" 
                    placeholder="Ej: Mantenimiento, Descuento por pronto pago"
                    value={adjustmentNote}
                    onChange={handleAdjustmentNoteChange}
                    onBlur={handleAdjustmentNoteBlur}
                    className={validationErrors.adjustmentName ? 'error' : ''}
                />
                <ErrorMessage error={validationErrors.adjustmentName} />
            </div>

            <div className="form-group">
                <label htmlFor="adjustment-amount">Valor</label>
                <MonetaryInput
                    id="adjustment-amount"
                    value={adjustmentValue}
                    onChange={handleAdjustmentValueChange}
                    onBlur={handleAdjustmentValueBlur}
                    placeholder="$0"
                    className={validationErrors.adjustmentAmount ? 'error' : ''}
                    min={0}
                />
                <ErrorMessage error={validationErrors.adjustmentAmount} />
            </div>

            <div className="form-group">
                <label>Tipo</label>
                <div className="radio-group">
                    <label>
                        <input 
                            type="radio" 
                            name="adjustment-type" 
                            value={AdjustmentTypeEnum.EXTRA_CHARGE.Key}
                            checked={adjustmentType === AdjustmentTypeEnum.EXTRA_CHARGE.Key}
                            onChange={handleAdjustmentTypeChange}
                        /> 
                        {AdjustmentTypeEnum.EXTRA_CHARGE.Value}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="adjustment-type" 
                            value={AdjustmentTypeEnum.DISCOUNT.Key}
                            checked={adjustmentType === AdjustmentTypeEnum.DISCOUNT.Key}
                            onChange={handleAdjustmentTypeChange}
                        /> 
                        {AdjustmentTypeEnum.DISCOUNT.Value}
                    </label>
                </div>
                <ErrorMessage error={validationErrors.adjustmentType} />
            </div>

            <div className="form-group">
                <button className="button" type="button" onClick={handleAddAdjustment}>
                    Agregar ajuste
                </button>
            </div>
        </>
    );
}
