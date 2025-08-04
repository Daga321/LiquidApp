import { IInvoice } from "../Models/Invoice";
import { IProperty } from "../Models/Property";

/**
 * Interface for ResultsHeaderData component props
 */
export interface IResultsHeaderDataProps {
    invoice: IInvoice;
}

/**
 * Interface for ResultsTable component props
 */
export interface IResultsTableProps {
    properties: IProperty[];
}
