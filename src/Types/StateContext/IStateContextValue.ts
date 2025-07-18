import { IAppState } from "./IAppState";
import { IInvoice } from "../Models/Invoice";
import { IProperty } from "../Models/Property";
import { IAdjustment } from "../Models/Adjustment";

/**
 * Interface for the state context value that defines all available methods and data
 */
export interface IStateContextValue {
    data: IAppState;
    setData: (data: IAppState | ((prev: IAppState) => IAppState)) => void;
    handleChange: (e: { target: { name: string; value: any } }) => void;
    
    // Property management
    addProperty: (propertyData?: Partial<IProperty>) => void;
    removeProperty: (propertyIndex: number) => void;
    updateProperty: (propertyIndex: number, field: keyof IProperty, value: any) => void;
    
    // Adjustment management
    addAdjustment: (propertyIndex: number, adjustment: IAdjustment) => void;
    removeAdjustment: (propertyIndex: number, adjustmentIndex: number) => void;
    updateAdjustment: (propertyIndex: number, adjustmentIndex: number, field: keyof IAdjustment, value: any) => void;
    
    // Invoice management
    updateInvoice: (field: keyof IInvoice, value: any) => void;
    
}
