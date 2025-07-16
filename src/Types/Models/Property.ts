import { ILiquidationMethod } from './Enums/LiquidationMethodEnum';
import { IAdjustment } from './Adjustment';

/**
 * Interface representing a property with billing method and monetary adjustments
 */
export interface IProperty {
  name: string;
  method: ILiquidationMethod;
  baseValue: number;
  amountToPay: number;
  adjustmentValue: number;
  totalToPay: number;
  adjustmentsList: IAdjustment[];
}

/**
 * Interface for Property class constructor parameters
 */
export interface IPropertyConstructor {
  name: string;
  method: ILiquidationMethod;
}
