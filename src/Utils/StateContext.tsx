import { createContext, useContext, useState } from "react";
import { IInvoice } from "../Types/Models/Invoice";
import { IProperty } from "../Types/Models/Property";
import { IAdjustment } from "../Types/Models/Adjustment";
import { ILiquidationMethod } from "../Types/Models/Enums/LiquidationMethodEnum";
import { IAdjustmentType } from "../Types/Models/Enums/AdjustmentTypeEnum";
import { IStateContextValue } from "../Types/StateContext/IStateContextValue";

// Interface for provider props
interface IStateProviderProps {
    children: any;
}

const StateContext = createContext(undefined as IStateContextValue | undefined);

export const StateProvider = ({ children }: IStateProviderProps) => {
    const [data, setData] = useState({
        // Invoice data
        invoice: {
            serviceName: "",
            billValue: 0,
            valuePerPeople: 0,
            unit: "",
            periodStart: undefined,
            periodEnd: undefined,
            dueDate: undefined,
            unitCost: 0,
            singleMeter: true
        },
        // Properties list
        properties: [],
        // Optional state properties
        currentStep: 0,
        isLoading: false,
        results: null
    });

    const handleChange = (e: { target: { name: string; value: any } }): void => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Helper functions for managing properties
    const addProperty = (propertyData: Partial<IProperty> | null = null): void => {
        const newProperty: IProperty = {
            name: propertyData?.name || "",
            method: propertyData?.method || {} as ILiquidationMethod,
            baseValue: propertyData?.baseValue || 0,
            amountToPay: propertyData?.amountToPay || 0,
            adjustmentValue: propertyData?.adjustmentValue || 0,
            totalToPay: propertyData?.totalToPay || 0,
            adjustmentsList: propertyData?.adjustmentsList || []
        };

        setData((prev) => ({
            ...prev,
            properties: [
                ...prev.properties,
                newProperty
            ]
        }));
    };

    const removeProperty = (propertyIndex: number): void => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.filter((_, index) => index !== propertyIndex)
        }));
    };

    const updateProperty = (propertyIndex: number, field: keyof IProperty, value: any): void => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map((prop, index) =>
                index === propertyIndex ? { ...prop, [field]: value } : prop
            )
        }));
    };

    // Helper functions for managing adjustments
    const addAdjustment = (propertyIndex: number, adjustment: Partial<IAdjustment>): void => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map((prop, index) =>
                index === propertyIndex
                    ? {
                        ...prop,
                        adjustmentsList: [
                            ...prop.adjustmentsList,
                            {
                                note: adjustment.note || "",
                                value: adjustment.value || 0,
                                type: adjustment.type || {} as IAdjustmentType
                            }
                        ]
                    }
                    : prop
            )
        }));
    };

    const removeAdjustment = (propertyIndex: number, adjustmentIndex: number): void => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map((prop, index) =>
                index === propertyIndex
                    ? {
                        ...prop,
                        adjustmentsList: prop.adjustmentsList.filter((_, adjIndex) => adjIndex !== adjustmentIndex)
                    }
                    : prop
            )
        }));
    };

    const updateAdjustment = (propertyIndex: number, adjustmentIndex: number, field: keyof IAdjustment, value: any): void => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map((prop, index) =>
                index === propertyIndex
                    ? {
                        ...prop,
                        adjustmentsList: prop.adjustmentsList.map((adj, adjIndex) =>
                            adjIndex === adjustmentIndex ? { ...adj, [field]: value } : adj
                        )
                    }
                    : prop
            )
        }));
    };

    // Helper function to update invoice data
    const updateInvoice = (field: keyof IInvoice, value: any): void => {
        setData((prev) => ({
            ...prev,
            invoice: {
                ...prev.invoice,
                [field]: value
            }
        }));
    };

    const contextValue: IStateContextValue = {
        data,
        setData,
        handleChange,
        // Property management
        addProperty,
        removeProperty,
        updateProperty,
        // Adjustment management
        addAdjustment,
        removeAdjustment,
        updateAdjustment,
        // Invoice management
        updateInvoice,
    };

    return (
        <StateContext.Provider value={contextValue}>
            {children}
        </StateContext.Provider>
    );
};

// Hook to consume the context more easily
export const useStateContext = (): IStateContextValue => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useStateContext must be used within a StateProvider');
    }
    return context;
};
