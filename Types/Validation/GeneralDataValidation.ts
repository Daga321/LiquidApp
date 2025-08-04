/**
 * Interface for date validation data
 */
export interface IDateValidationData {
  periodStart: string;
  periodEnd: string;
  dueDate: string;
}

/**
 * Interface for service name validation data
 */
export interface IServiceValidationData {
  serviceName: string;
  serviceOption: string;
}

/**
 * Interface for monetary values validation data
 */
export interface IMonetaryValidationData {
  billValue?: string | number;
  unit?: string;
  unitCost?: string | number;
}

/**
 * Interface for general data form validation (extends invoice with additional fields for validation)
 */
export interface IGeneralDataValidation {
  serviceName: string;
  serviceOption: string;
  billValue?: string | number;
  valuePerPeople?: number;
  unit?: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  unitCost?: string | number;
  singleMeter: boolean;
}
