import { IInvoice } from "../Models/Invoice";

// Interface for component props
export interface IGeneralDataFormProps {
    invoiceData: IInvoice & { serviceOption?: string };
    onUpdateInvoice: (field: keyof IInvoice , value: any) => void;
    errors?: Record<string, string>;
}