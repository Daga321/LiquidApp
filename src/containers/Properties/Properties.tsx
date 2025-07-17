import { useMemo, useState } from "react";
import { useStateContext } from "../../Utils/StateContext";
import { PropertiesForm } from "../../components/PropertiesForm/PropertiesForm";
import { PropertiesTableForm } from "../../components/PropertiesTableForm/PropertiesTableForm";
import { NextButton } from "../../components/Buttons/NextButton";
import { BackButton } from "../../components/Buttons/BackButton";
import { PropertiesValidation } from "../../Validation/PropertiesValidation";
import { IValidationResult } from "../../Types/Validation/ValidationBase";
import { IProperty } from "../../Types/Models/Property";
import { IPropertyFormData, IPropertyValidation } from "../../Types/Validation/PropertiesValidation";
import { ActionType } from "../../Types/Componets/DynamicTableTypes";
import LiquidationMethodEnum from "@/Models/Enums/LiquidationMethodEnum";

export function Properties(){
    const { data, addProperty, updateProperty, removeProperty, setData } = useStateContext();
    
    // Local state for form inputs
    const [formData, setFormData] = useState<IPropertyFormData>({
        propertyName: "",
        liquidationMethod: data.invoice.singleMeter === false ? LiquidationMethodEnum.CONSUMPTION : undefined
    });

    // Create validator instance
    const validator = useMemo(() => new PropertiesValidation(), []);

    // Validation result for form inputs - recomputes when form data changes
    const validationResult: IValidationResult = useMemo(() => {
        // Convert properties to validation format
        const propertiesValidation: IPropertyValidation[] = data.properties.map(prop => ({
            name: prop.name,
            method: prop.method.Key,
            baseValue: prop.baseValue
        }));
        
        return validator.validateAddProperty(formData, propertiesValidation);
    }, [validator, formData, data.properties]);

    // Validate existing properties
    const propertiesValidation: IValidationResult = useMemo(() => {
        const propertiesValidation: IPropertyValidation[] = data.properties.map(prop => ({
            name: prop.name,
            method: prop.method.Key,
            baseValue: prop.baseValue
        }));
        
        return validator.validatePropertiesTable(propertiesValidation, data.invoice.singleMeter);
    }, [validator, data.properties, data.invoice.singleMeter]);

    const handleFormDataChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddProperty = () => {
        if (!validationResult.isValid) {
            return;
        }

        // Add property with the form data
        const propertyData: Partial<IProperty> = {
            name: formData.propertyName,
            method: formData.liquidationMethod as any, // Will be converted by addProperty
            baseValue: 0 // Will be set later in the table
        };
        
        addProperty(propertyData);

        // Reset form
        setFormData({
            propertyName: "",
            liquidationMethod: data.invoice.singleMeter === false ? LiquidationMethodEnum.CONSUMPTION : undefined
        });
    };

    const handlePropertyChange = (index: number, field: keyof IProperty, value: any) => {
        updateProperty(index, field, value);
    };

    const handlePropertyAction = (action: ActionType, property: IProperty) => {
        const propertyIndex = data.properties.findIndex(p => 
            p.name === property.name && p.method.Key === property.method.Key
        );
        
        switch (action) {
            case "up":
                if (propertyIndex > 0) {
                    // Move property up by swapping with previous
                    const newProperties = [...data.properties];
                    [newProperties[propertyIndex], newProperties[propertyIndex - 1]] = 
                    [newProperties[propertyIndex - 1], newProperties[propertyIndex]];
                    // Update using setData to trigger re-render
                    setData(prev => ({
                        ...prev,
                        properties: newProperties
                    }));
                }
                break;
                
            case "down":
                if (propertyIndex < data.properties.length - 1) {
                    // Move property down by swapping with next
                    const newProperties = [...data.properties];
                    [newProperties[propertyIndex], newProperties[propertyIndex + 1]] = 
                    [newProperties[propertyIndex + 1], newProperties[propertyIndex]];
                    // Update using setData to trigger re-render
                    setData(prev => ({
                        ...prev,
                        properties: newProperties
                    }));
                }
                break;
                
            case "delete":
                removeProperty(propertyIndex);
                break;
        }
    };

    return (
        <>
            <PropertiesForm 
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onAddProperty={handleAddProperty}
                errors={validationResult.errors}
                canAddProperty={validationResult.isValid}
            />
            
            <PropertiesTableForm
                properties={data.properties}
                onPropertyChange={handlePropertyChange}
                onPropertyAction={handlePropertyAction}
                errors={propertiesValidation.errors}
            />
            
            <div className="btn-actions">
                <BackButton />
                <NextButton disabled={data.properties.length === 0 || !propertiesValidation.isValid} />
            </div>
        </>
    );
}
