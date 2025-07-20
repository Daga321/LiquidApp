/**
 * Interface for adjustment form data validation
 */
export interface IAdjustmentFormValidation {
  adjustmentName: string;
  adjustmentAmount: number;
  adjustmentType: string;
  selectedPropertyId: string;
  applyToAll: boolean;
}
