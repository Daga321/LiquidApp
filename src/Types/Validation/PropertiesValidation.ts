import { ILiquidationMethod } from "../Models/Enums/LiquidationMethodEnum";

/**
 * Interface for property form data used in validation
 */
export interface IPropertyFormData {
  propertyName: string;
  liquidationMethod: ILiquidationMethod | undefined;
}

/**
 * Interface for property data used in table validation
 * Simplified version of IProperty for validation purposes
 */
export interface IPropertyValidation {
  name: string;
  method: string;
  baseValue: string | number;
}
