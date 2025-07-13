import { useStateContext } from "../../Utils/StateContext.jsx";
import { AdjustmentForm } from "../../components/AdjustmentForm/AdjustmentForm.jsx";
import { NextButton } from "../../components/Buttons/NextButton.jsx";
import { BackButton } from "../../components/Buttons/BackButton.jsx";

export function Adjustment() {

    const { data, handleChange } = useStateContext();
    return (
        <>
            <AdjustmentForm />
            <div className="btn-actions">
                <BackButton />
                <NextButton fuction={() => false} />
            </div>
        </>
    );
}