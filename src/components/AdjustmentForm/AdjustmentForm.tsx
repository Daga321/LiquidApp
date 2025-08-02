import { AdjustmentTypeEnum } from "../../Models/Enums/AdjustmentTypeEnum.js";
import { IAdjustmentFormProps } from "../../Types/Componets/IAdjustmentFormProps.js";
import { MonetaryInput } from "../MonetaryInput/MonetaryInput.tsx";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage.tsx";
import './Adjustments.css';

/**
 * AdjustmentForm Component
 * Renders the form for adjustments input
 */
export function AdjustmentForm({ 
    formData, 
    onFormDataChange, 
    onAddAdjustment, 
    errors, 
    canAddAdjustment 
}: IAdjustmentFormProps) {

    // Handle input changes
    const handleAdjustmentNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormDataChange('adjustmentName', e.target.value);
    };

    const handleAdjustmentValueChange = (value: number) => {
        onFormDataChange('adjustmentAmount', value);
    };

    const handleAdjustmentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormDataChange('adjustmentType', e.target.value);
    };

    const handleAddClick = () => {
        onAddAdjustment();
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor="adjustment-name">Concepto</label>
                <input 
                    type="text" 
                    id="adjustment-name" 
                    placeholder="Ej: Mantenimiento, Descuento por pronto pago"
                    value={formData.adjustmentName}
                    onChange={handleAdjustmentNoteChange}
                    className={errors.adjustmentName ? 'error' : ''}
                />
                <ErrorMessage error={errors.adjustmentName} />
            </div>

            <div className="form-group">
                <label htmlFor="adjustment-amount">Valor</label>
                <MonetaryInput
                    id="adjustment-amount"
                    value={formData.adjustmentAmount}
                    onChange={handleAdjustmentValueChange}
                    placeholder="$0"
                    className={errors.adjustmentAmount ? 'error' : ''}
                    min={0}
                />
                <ErrorMessage error={errors.adjustmentAmount} />
            </div>

            <div className="form-group">
                <label>Tipo</label>
                <div className="radio-group">
                    <label>
                        <input 
                            type="radio" 
                            name="adjustment-type" 
                            value={AdjustmentTypeEnum.EXTRA_CHARGE.Key}
                            checked={formData.adjustmentType === AdjustmentTypeEnum.EXTRA_CHARGE.Key}
                            onChange={handleAdjustmentTypeChange}
                        /> 
                        {AdjustmentTypeEnum.EXTRA_CHARGE.Value}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="adjustment-type" 
                            value={AdjustmentTypeEnum.DISCOUNT.Key}
                            checked={formData.adjustmentType === AdjustmentTypeEnum.DISCOUNT.Key}
                            onChange={handleAdjustmentTypeChange}
                        /> 
                        {AdjustmentTypeEnum.DISCOUNT.Value}
                    </label>
                </div>
                <ErrorMessage error={errors.adjustmentType} />
            </div>

            <div className="form-group">
                <button 
                    className="button" 
                    type="button" 
                    onClick={handleAddClick}
                    disabled={!canAddAdjustment}
                >
                    Agregar ajuste
                </button>
            </div>
        </>
    );
}
