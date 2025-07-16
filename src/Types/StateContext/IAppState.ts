import { IInvoice } from "../Models/Invoice";
import { IProperty } from "../Models/Property";

/**
 * Interface for the complete application state
 */
export interface IAppState {
    invoice: IInvoice;
    properties: IProperty[];
}
