import { useMemo, useState } from "react";
import { useStateContext } from "../../Utils/StateContext";
import { PropertiesForm } from "../../components/PropertiesForm/PropertiesForm";
import { NextButton } from "../../components/Buttons/NextButton";
import { BackButton } from "../../components/Buttons/BackButton";
import { PropertiesValidation } from "../../Validation/PropertiesValidation";
import { IValidationResult } from "../../Types/Validation/ValidationBase";
import { IProperty } from "../../Types/Models/Property";
import { IPropertyFormData, IPropertyValidation } from "../../Types/Validation/PropertiesValidation";

export function Properties(){
    const { data, addProperty } = useStateContext();
    
    // Local state for form inputs
    const [formData, setFormData] = useState<IPropertyFormData & { methodValue: number }>({
        propertyName: "",
        liquidationMethod: data.invoice.singleMeter === false ? "CONSUMPTION" : "",
        methodValue: 0
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
            baseValue: formData.methodValue
        };
        
        addProperty(propertyData);

        // Reset form
        setFormData({
            propertyName: "",
            liquidationMethod: data.invoice.singleMeter === false ? "CONSUMPTION" : "",
            methodValue: 0
        });
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
            <div className="btn-actions">
                <BackButton />
                <NextButton disabled={data.properties.length === 0} />
            </div>
        </>
    );
}
