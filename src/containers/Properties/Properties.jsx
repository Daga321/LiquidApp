import { useStateContext } from "../../Utils/StateContext.jsx";
import { PropertiesForm } from "../../components/PropertiesForm/PropertiesForm.jsx";
import { NextButton } from "../../components/Buttons/NextButton.jsx";
import { BackButton } from "../../components/Buttons/BackButton.jsx";

export function Properties() {
    const { data, handleChange } = useStateContext();

    return (
        <>
            <PropertiesForm />
            <div className="btn-actions">
                <BackButton />
                <NextButton fuction={() => false} />
            </div>
        </>
    );
}