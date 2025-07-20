import { useState, useMemo, useEffect } from "react";
import { useStateContext } from "../../Utils/StateContext.js";
import { AdjustmentForm } from "../../components/AdjustmentForm/AdjustmentForm.tsx";
import { NextButton } from "../../components/Buttons/NextButton.tsx";
import { BackButton } from "../../components/Buttons/BackButton.tsx";
import { AdjustmentTable } from "../../components/AdjustmentTable/AdjustementTable.tsx";
import { Message } from "../../components/Message/Message.tsx";
import { PropertySelector } from "../../components/PropertySelector/PropertySelector.tsx";
import { IAdjustment } from "../../Types/Models/Adjustment.js";
import { AdjustmentValidation } from "../../Validation/AdjustmentValidation.js";
import { IValidationResult } from "../../Types/Validation/ValidationBase.js";
import { IAdjustmentFormValidation } from "../../Types/Validation/AdjustmentValidation.js";

export function Adjustment() {
    const { data, addAdjustment } = useStateContext();
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
    const [applyToAll, setApplyToAll] = useState(false);
    
    // Local state for form inputs
    const [formData, setFormData] = useState<IAdjustmentFormValidation>({
        adjustmentName: "",
        adjustmentAmount: 0,
        adjustmentType: "",
        selectedPropertyId: selectedPropertyId,
        applyToAll: applyToAll
    });

    // Create validator instance
    const validator = useMemo(() => new AdjustmentValidation(), []);

    // Update formData when selectedPropertyId or applyToAll changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            selectedPropertyId: selectedPropertyId,
            applyToAll: applyToAll
        }));
    }, [selectedPropertyId, applyToAll]);

    // Get existing adjustments for validation
    const getExistingAdjustments = () => {
        if (applyToAll) {
            // Return all adjustments from all properties
            return data.properties.flatMap(property => property.adjustmentsList);
        } else if (selectedPropertyId) {
            // Return adjustments from selected property
            const propertyIndex = parseInt(selectedPropertyId);
            if (propertyIndex >= 0 && propertyIndex < data.properties.length) {
                return data.properties[propertyIndex].adjustmentsList;
            }
        }
        return [];
    };

    // Validation result for form inputs - recomputes when form data changes
    const validationResult: IValidationResult = useMemo(() => {
        return validator.validate(formData, getExistingAdjustments(), data.properties.length);
    }, [validator, formData, selectedPropertyId, applyToAll, data.properties]);

    const handleFormDataChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddAdjustment = () => {
        // Check validation first
        if (!validationResult.isValid) {
            return;
        }

        // Create adjustment object from form data
        const adjustment: IAdjustment = {
            note: formData.adjustmentName,
            value: formData.adjustmentAmount,
            type: formData.adjustmentType === "DISCOUNT" 
                ? { Key: "DISCOUNT", Value: "Descuento" }
                : { Key: "EXTRA_CHARGE", Value: "Cargo adicional" }
        };

        if (applyToAll) {
            // Apply to all properties
            data.properties.forEach((_, index) => {
                addAdjustment(index, adjustment);
            });
        } else {
            const propertyIndex = parseInt(selectedPropertyId);
            addAdjustment(propertyIndex, adjustment);
        }

        // Reset form after successful addition
        setFormData({
            adjustmentName: "",
            adjustmentAmount: 0,
            adjustmentType: "",
            selectedPropertyId: selectedPropertyId,
            applyToAll: applyToAll
        });
    };

    const handlePropertyChange = (propertyId: string) => {
        setSelectedPropertyId(propertyId);
    };

    return (
        <>
            <Message message="No es obligatorio realizar ajustes. Este proceso puede ser omitido." type="warning" />
            <PropertySelector 
                properties={data.properties}
                selectedPropertyId={selectedPropertyId}
                onPropertyChange={handlePropertyChange}
                disabled={applyToAll}
                errors={validationResult.errors}
                includeAllOption={true}
            />
            <AdjustmentForm 
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onAddAdjustment={handleAddAdjustment}
                errors={validationResult.errors}
                canAddAdjustment={validationResult.isValid}
            />
            <AdjustmentTable selectedPropertyId={selectedPropertyId} />
            <div className="btn-actions">
                <BackButton />
                <NextButton disabled={false} />
            </div>
        </>
    );
}