import { IAdjustmentFormValidation } from '../Validation/AdjustmentValidation';

/**
 * Props interface for AdjustmentForm component
 */
export interface IAdjustmentFormProps {
    formData: IAdjustmentFormValidation;
    onFormDataChange: (field: string, value: string | number) => void;
    onAddAdjustment: () => void;
    errors: Record<string, string>;
    canAddAdjustment: boolean;
}
