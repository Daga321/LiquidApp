import React, { createContext, useContext, useState } from "react";
import { IInvoice } from "../Types/Models/Invoice";
import { IProperty } from "../Types/Models/Property";
import { IAdjustment } from "../Types/Models/Adjustment";
import { ILiquidationMethod } from "../Types/Models/Enums/LiquidationMethodEnum";
import { IAdjustmentType } from "../Types/Models/Enums/AdjustmentTypeEnum";
import { IStateContextValue } from "../Types/StateContext/IStateContextValue";
import { IAppState } from "../Types/StateContext/IAppState";

// Interface for provider props
interface IStateProviderProps {
    children: React.ReactNode;
}

const StateContext = createContext<IStateContextValue | undefined>(undefined);

export const StateProvider = ({ children }: IStateProviderProps) => {
    const [data, setData] = useState<IAppState>({
        // Invoice data
        invoice: {
            serviceName: "",
            serviceOption: "",
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
        properties: [] as IProperty[]
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

        setData((prev: IAppState) => ({
            ...prev,
            properties: [
                ...prev.properties,
                newProperty
            ]
        }));
    };

    const removeProperty = (propertyIndex: number): void => {
        setData((prev: IAppState) => ({
            ...prev,
            properties: prev.properties.filter((_: IProperty, index: number) => index !== propertyIndex)
        }));
    };

    const updateProperty = (propertyIndex: number, field: keyof IProperty, value: any): void => {
        setData((prev: IAppState) => ({
            ...prev,
            properties: prev.properties.map((prop: IProperty, index: number) =>
                index === propertyIndex ? { ...prop, [field]: value } : prop
            )
        }));
    };

    // Helper functions for managing adjustments
    const addAdjustment = (propertyIndex: number, adjustment: IAdjustment): void => {
        setData((prev: IAppState) => ({
            ...prev,
            properties: prev.properties.map((prop: IProperty, index: number) =>
                index === propertyIndex
                    ? {
                        ...prop,
                        adjustmentsList: [
                            ...prop.adjustmentsList,
                            adjustment
                        ]
                    }
                    : prop
            )
        }));
    };

    const removeAdjustment = (propertyIndex: number, adjustmentIndex: number): void => {
        setData((prev: IAppState) => ({
            ...prev,
            properties: prev.properties.map((prop: IProperty, index: number) =>
                index === propertyIndex
                    ? {
                        ...prop,
                        adjustmentsList: prop.adjustmentsList.filter((_: IAdjustment, adjIndex: number) => adjIndex !== adjustmentIndex)
                    }
                    : prop
            )
        }));
    };

    const updateAdjustment = (propertyIndex: number, adjustmentIndex: number, field: keyof IAdjustment, value: any): void => {
        setData((prev: IAppState) => ({
            ...prev,
            properties: prev.properties.map((prop: IProperty, index: number) =>
                index === propertyIndex
                    ? {
                        ...prop,
                        adjustmentsList: prop.adjustmentsList.map((adj: IAdjustment, adjIndex: number) =>
                            adjIndex === adjustmentIndex ? { ...adj, [field]: value } : adj
                        )
                    }
                    : prop
            )
        }));
    };

    const moveAdjustment = (propertyIndex: number, fromIndex: number, toIndex: number): void => {
        setData((prev: IAppState) => ({
            ...prev,
            properties: prev.properties.map((prop: IProperty, index: number) =>
                index === propertyIndex
                    ? {
                        ...prop,
                        adjustmentsList: (() => {
                            const newList = [...prop.adjustmentsList];
                            const [moved] = newList.splice(fromIndex, 1);
                            newList.splice(toIndex, 0, moved);
                            return newList;
                        })()
                    }
                    : prop
            )
        }));
    };

    // Helper function to update invoice data
    const updateInvoice = (field: keyof IInvoice, value: any): void => {
        setData((prev: IAppState) => ({
            ...prev,
            invoice: {
                ...prev.invoice,
                [field]: value
            }
        }));
    };

    const contextValue: IStateContextValue = {
        data: {
            invoice: data.invoice,
            properties: data.properties
        },
        setData: (newData) => {
            if (typeof newData === 'function') {
                setData((prev: IAppState) => {
                    const result = newData({ invoice: prev.invoice, properties: prev.properties });
                    return { ...prev, ...result };
                });
            } else {
                setData((prev: IAppState) => ({ ...prev, ...newData }));
            }
        },
        handleChange,
        // Property management
        addProperty,
        removeProperty,
        updateProperty,
        // Adjustment management
        addAdjustment,
        removeAdjustment,
        updateAdjustment,
        moveAdjustment,
        // Invoice management
        updateInvoice: updateInvoice,
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
