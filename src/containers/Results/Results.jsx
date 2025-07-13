import { useStateContext } from "../../Utils/StateContext.jsx";
import { ResultsView } from "../../components/Results/Results.jsx";
import { BackButton } from "../../components/Buttons/BackButton.jsx";
import { ShareButton } from "../../components/Buttons/ShareButton.jsx";

export function Results() {

    const { data } = useStateContext();

    return (
        <>  <div id="sharable-results">
                <ResultsView />
            </div>
            <div className="btn-actions">
                <BackButton />
                <ShareButton />
            </div>
        </>
    );

}