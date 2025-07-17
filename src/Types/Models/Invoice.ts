/**
 * Interface representing an invoice with service details and billing information
 */
export interface IInvoice {
  serviceName: string;
  serviceOption: string;
  billValue: number;
  valuePerPeople: number;
  unit: string;
  periodStart?: Date;
  periodEnd?: Date;
  dueDate?: Date;
  unitCost: number;
  singleMeter: boolean;
}

/**
 * Interface for Invoice class constructor parameters
 */
export interface IInvoiceConstructor {
  serviceName: string;
  serviceOption: string;
  billValue: number;
  valuePerPeople: number;
  unit: string;
  periodStart: Date | undefined;
  periodEnd: Date | undefined;
  dueDate: Date | undefined;
  unitCost: number;
  singleMeter: boolean;
}
