import { useStateContext } from "../../Utils/StateContext.jsx";
import { GeneralDataForm } from "../../components/GeneralDataForm/GeneralDataForm.jsx";
import { NextButton } from "../../components/Buttons/NextButton.jsx";

export function GeneralData() {
    const { data, updateInvoice } = useStateContext();
    
    return (
        <>
            <GeneralDataForm 
                invoiceData={data.invoice}
                onUpdateInvoice={updateInvoice}
            />
            <div className="btn-actions">
                <NextButton fuction={() => false} />
            </div>
        </>
    );
}
