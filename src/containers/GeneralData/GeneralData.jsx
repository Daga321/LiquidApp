import { useMemo } from "react";
import { useStateContext } from "../../Utils/StateContext.jsx";
import { GeneralDataForm } from "../../components/GeneralDataForm/GeneralDataForm.jsx";
import { NextButton } from "../../components/Buttons/NextButton.jsx";
import { GeneralDataValidation } from "../../Validation/GeneralDataValidation.js";

export function GeneralData() {
    const { data, updateInvoice } = useStateContext();

    // Create validator instance
    const validator = useMemo(() => new GeneralDataValidation(), []);

    // Validation result - recomputes when invoice data change
    const validationResult = useMemo(() => {
        return validator.validate(data.invoice);
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
