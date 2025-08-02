import { useStateContext } from "../../Utils/StateContext.js";
import { useLiquidation } from "../../Utils/useLiquidation.js";
import { ResultsHeaderData } from "../../components/ResultsHeaderData/ResultsHeaderData.js";
import { ResultsTable } from "../../components/ResultsTable/ResultsTable.js";
import { BackButton } from "../../components/Buttons/BackButton.js";
import { ShareButton } from "../../components/Buttons/ShareButton.js";
import { useEffect } from "react";

export function Results() {
    const { data } = useStateContext();
    const { performLiquidation } = useLiquidation();

    // Calcula las liquidaciones solo cuando cambien los datos relevantes
    useEffect(() => {
        if (data.properties.length > 0) {
            performLiquidation();
        }
    }, [
        data.invoice.billValue,
        data.invoice.valuePerPeople,
        data.invoice.unitCost,
        data.properties.length,
        JSON.stringify(data.properties.map((p) => ({
            method: p.method.Key,
            baseValue: p.baseValue,
            adjustments: p.adjustmentsList
        })))
    ]);

    return (
        <>
            <div id="sharable-results">
                <ResultsHeaderData invoice={data.invoice} />
                <ResultsTable 
                    properties={data.properties}
                />
            </div>
            <div className="btn-actions">
                <BackButton />
                <ShareButton />
            </div>
        </>
    );
}