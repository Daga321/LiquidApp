/**
 * Results Component
 * Renders the results table and liquidation information
 */
export function Results() {
    return (
        <>
            <h2 id="service-name-information" className="section-title"></h2>

            <div className="form-group full-width no-padding">
                <table className="layout-table">
                    <tbody>
                        <tr>
                            <td className="label-cell">
                                <label id="liquidationDateLabel">Fecha de liquidación:</label>
                            </td>
                            <td className="value-cell" rowSpan="2">
                                {/* Dinamically show day until due date or "PAGO URGENTE" */}
                                <label id="urgent-payment"></label>
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">
                                <label id="dueDateLabel">Fecha límite de pago:</label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="form-group" id="unit-or-person-value">
                <label id="unit-cost-information"></label>
                {/* dinamicalty show unit cost or value per person*/}
            </div>

            <div className="table-wrapper resulTableWraper">
                <table className="fixed-table resultTable">
                    <thead>
                        <tr>
                            <th>Propiedad</th>
                            <th>Método de liquidación</th>
                            <th>Base</th>
                            <th>Consumo liquidado</th>
                            <th>Ajustes</th>
                            <th>Total a pagar</th>
                        </tr>
                    </thead>
                    <tbody id="properties-table-body">
                        {/* Dinamically shows properties inforamtion */}
                    </tbody>
                </table>
            </div>

            <div className="btn-actions">
                <button className="button" onClick="prevStep()">Atrás</button>
                <button className="button" onClick="shareResults()">Copiar para enviar</button>
            </div>
        </>
    );
}
