import { IAdjustmentType } from './Enums/AdjustmentTypeEnum';

/**
 * Interface representing a monetary adjustment (discount or extra charge)
 */
export interface IAdjustment {
  note: string;
  value: number;
  type: IAdjustmentType;
}

/**
 * Interface for Adjustment class constructor parameters
 */
export interface IAdjustmentConstructor {
  note: string;
  value: number;
  type: IAdjustmentType;
}
