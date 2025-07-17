import React, { useMemo } from "react";
import { useStateContext } from "../../Utils/StateContext";
import { GeneralDataForm } from "../../components/GeneralDataForm/GeneralDataForm";
import { NextButton } from "../../components/Buttons/NextButton";
import { GeneralDataValidation } from "../../Validation/GeneralDataValidation";
import { IValidationResult } from "../../Types/Validation/ValidationBase";
import { IGeneralDataValidation } from "../../Types/Validation/GeneralDataValidation";

export function GeneralData(): React.JSX.Element {
    const { data, updateInvoice } = useStateContext();

    // Create validator instance
    const validator = useMemo(() => new GeneralDataValidation(), []);

    // Validation result - recomputes when invoice data change
    const validationResult: IValidationResult = useMemo(() => {
        // Convert invoice data to validation format
        const validationData: IGeneralDataValidation = {
            serviceName: data.invoice.serviceName,
            serviceOption: (data.invoice as any).serviceOption || "",
            billValue: data.invoice.billValue,
            valuePerPeople: data.invoice.valuePerPeople,
            unit: data.invoice.unit,
            periodStart: data.invoice.periodStart ? data.invoice.periodStart.toString() : "",
            periodEnd: data.invoice.periodEnd ? data.invoice.periodEnd.toString() : "",
            dueDate: data.invoice.dueDate ? data.invoice.dueDate.toString() : "",
            unitCost: data.invoice.unitCost,
            singleMeter: data.invoice.singleMeter
        };
        return validator.validate(validationData);
    }, [validator, data.invoice]);

    
    return (
        <>
            <GeneralDataForm 
                invoiceData={data.invoice}
                onUpdateInvoice={updateInvoice}
                errors={validationResult.errors}
            />
            <div className="btn-actions">
                <NextButton
                    disabled={!validationResult.isValid}
                />
            </div>
        </>
    );
}
