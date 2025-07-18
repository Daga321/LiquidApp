import { useState } from "react";
import { useStateContext } from "../../Utils/StateContext.js";
import { AdjustmentForm } from "../../components/AdjustmentForm/AdjustmentForm.tsx";
import { NextButton } from "../../components/Buttons/NextButton.tsx";
import { BackButton } from "../../components/Buttons/BackButton.tsx";
import { AdjustmentTable } from "../../components/AdjustmentTable/AdjustementTable.tsx";
import { Message } from "../../components/Message/Message.tsx";
import { PropertySelector } from "../../components/PropertySelector/PropertySelector.tsx";
import { IAdjustment } from "../../Types/Models/Adjustment.js";

export function Adjustment() {
    const { data, addAdjustment } = useStateContext();
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
    const [applyToAll, setApplyToAll] = useState(false);

    const handleAddAdjustment = (adjustment: IAdjustment) => {
        if (applyToAll) {
            // Apply to all properties
            data.properties.forEach((_, index) => {
                addAdjustment(index, adjustment);
            });
        } else {
            if (!selectedPropertyId) {
                alert("Por favor seleccione una propiedad");
                return;
            }
            addAdjustment(parseInt(selectedPropertyId), adjustment);
        }
    };

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

    return (
        <>
            <Message message="No es obligatorio realizar ajustes. Este proceso puede ser omitido." type="info" />
            <PropertySelector 
                properties={data.properties}
                selectedPropertyId={selectedPropertyId}
                onPropertyChange={setSelectedPropertyId}
                disabled={applyToAll}
                includeAllOption={true}
            />
            <AdjustmentForm 
                onAddAdjustment={handleAddAdjustment}
                existingAdjustments={getExistingAdjustments()}
            />
            <AdjustmentTable selectedPropertyId={selectedPropertyId} />
            <div className="btn-actions">
                <BackButton />
                <NextButton disabled={false} />
            </div>
        </>
    );
}