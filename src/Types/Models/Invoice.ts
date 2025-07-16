/**
 * Interface representing an invoice with service details and billing information
 */
export interface IInvoice {
  serviceName: string;
  billValue: number;
  valuePerPeople: number;
  unit: string;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  unitCost: number;
  singleMeter: boolean;
}

/**
 * Interface for Invoice class constructor parameters
 */
export interface IInvoiceConstructor {
  serviceName: string;
  billValue: number;
  valuePerPeople: number;
  unit: string;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  unitCost: number;
  singleMeter: boolean;
}
