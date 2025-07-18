import { IAdjustment } from '../Models/Adjustment';

/**
 * Props interface for AdjustmentForm component
 */
export interface IAdjustmentFormProps {
    onAddAdjustment: (adjustment: IAdjustment) => void;
    existingAdjustments?: IAdjustment[];
}
