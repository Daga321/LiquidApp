import { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [data, setData] = useState({
        // Invoice data
        invoice: {
            serviceName: "",
            billValue: 0,
            valuePerPeople: 0,
            servicesAmount: 0
        },
        // Properties list
        properties: [
            {
                id: 1,
                name: "",
                method: null, // Will be one of LiquidationMethodEnum values
                baseValue: 0,
                amountToPay: 0,
                adjustmentValue: 0,
                totalToPay: 0,
                adjustmentsList: [
                    // Each adjustment will have:
                    // {
                    //   note: "",
                    //   value: 0,
                    //   type: null // Will be AdjustmentTypeEnum.DISCOUNT or AdjustmentTypeEnum.EXTRA_CHARGE
                    // }
                ]
            }
        ],
        // Current step in the stepper
        currentStep: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Helper functions for managing properties
    const addProperty = () => {
        setData((prev) => ({
            ...prev,
            properties: [
                ...prev.properties,
                {
                    id: Date.now(), // Simple ID generation
                    name: "",
                    method: null,
                    baseValue: 0,
                    amountToPay: 0,
                    adjustmentValue: 0,
                    totalToPay: 0,
                    adjustmentsList: []
                }
            ]
        }));
    };

    const removeProperty = (propertyId) => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.filter(prop => prop.id !== propertyId)
        }));
    };

    const updateProperty = (propertyId, field, value) => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === propertyId ? { ...prop, [field]: value } : prop
            )
        }));
    };

    // Helper functions for managing adjustments
    const addAdjustment = (propertyId, adjustment) => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === propertyId
                    ? {
                        ...prop,
                        adjustmentsList: [
                            ...prop.adjustmentsList,
                            {
                                id: Date.now(),
                                note: adjustment.note || "",
                                value: adjustment.value || 0,
                                type: adjustment.type || null
                            }
                        ]
                    }
                    : prop
            )
        }));
    };

    const removeAdjustment = (propertyId, adjustmentId) => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === propertyId
                    ? {
                        ...prop,
                        adjustmentsList: prop.adjustmentsList.filter(adj => adj.id !== adjustmentId)
                    }
                    : prop
            )
        }));
    };

    const updateAdjustment = (propertyId, adjustmentId, field, value) => {
        setData((prev) => ({
            ...prev,
            properties: prev.properties.map(prop =>
                prop.id === propertyId
                    ? {
                        ...prop,
                        adjustmentsList: prop.adjustmentsList.map(adj =>
                            adj.id === adjustmentId ? { ...adj, [field]: value } : adj
                        )
                    }
                    : prop
            )
        }));
    };

    // Helper function to update invoice data
    const updateInvoice = (field, value) => {
        setData((prev) => ({
            ...prev,
            invoice: {
                ...prev.invoice,
                [field]: value
            }
        }));
    };

    // Helper function to update current step
    const setCurrentStep = (step) => {
        setData((prev) => ({
            ...prev,
            currentStep: step
        }));
    };

    // Helper function to set loading state
    const setLoading = (isLoading) => {
        setData((prev) => ({
            ...prev,
            isLoading
        }));
    };

    // Helper function to update results
    const updateResults = (results) => {
        setData((prev) => ({
            ...prev,
            results: {
                ...prev.results,
                ...results
            }
        }));
    };

    return (
        <StateContext.Provider value={{
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
            // Navigation
            setCurrentStep
        }}>
            {children}
        </StateContext.Provider>
    );
};

// Hook para consumir el contexto más fácilmente
export const useStateContext = () => useContext(StateContext);


/* how to use it in a component
import { useStateContext } from './utils/StateContext.jsx';

export function MyComponent() {
    const { data, handleChange } = useStateContext();

    return (
        <form>
            
            <input
                type="text"
                name="nombre"
                value={data.invoice.serviceName}
                onChange={handleChange}
            />
            <input
                type="number"
                name="edad"
                value={data.invoice.billValue}
                onChange={handleChange}
            />
            <pre>{JSON.stringify(data.invoice, null, 2)}</pre>
        </form>
    );
}

*/

