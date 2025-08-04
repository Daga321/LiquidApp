/**
 * Interface for adjustment type enum values
 */
export interface IAdjustmentType {
  Key: string;
  Value: string;
}

/**
 * Interface for the AdjustmentTypeEnum object
 */
export interface IAdjustmentTypeEnum {
  DISCOUNT: IAdjustmentType;
  EXTRA_CHARGE: IAdjustmentType;
}
