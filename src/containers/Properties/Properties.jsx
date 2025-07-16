import { useMemo, useState } from "react";
import { useStateContext } from "../../Utils/StateContext.jsx";
import { PropertiesForm } from "../../components/PropertiesForm/PropertiesForm.jsx";
import { NextButton } from "../../components/Buttons/NextButton.jsx";
import { BackButton } from "../../components/Buttons/BackButton.jsx";
import { PropertiesValidation } from "../../Validation/PropertiesValidation.js";

export function Properties() {
    const { data, addProperty } = useStateContext();
    
    // Local state for form inputs
    const [formData, setFormData] = useState({
        propertyName: "",
        liquidationMethod: data.invoice.singleMeter === false ? "CONSUMPTION" : "",
        methodValue: 0
    });

    // Create validator instance
    const validator = useMemo(() => new PropertiesValidation(), []);

    // Validation result for form inputs - recomputes when form data changes
    const validationResult = useMemo(() => {
        return validator.validateAddProperty(formData, data.properties);
    }, [validator, formData, data.properties]);

    const handleFormDataChange = (field, value) => {
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
        addProperty({
            name: formData.propertyName,
            method: formData.liquidationMethod,
            baseValue: formData.methodValue
        });

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