/**
 * Interface for liquidation method enum values
 */
export interface ILiquidationMethod {
  Key: string;
  Method: string;
  InputPlaceHolder: string;
}

/**
 * Interface for the LiquidationMethodEnum object
 */
export interface ILiquidationMethodEnum {
  CONSUMPTION: ILiquidationMethod;
  PERCENTAGE: ILiquidationMethod;
  PEOPLE: ILiquidationMethod;
}
