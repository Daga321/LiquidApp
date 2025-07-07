/**
 * AdjustmentForm Component
 * Renders the form for adjustments input
 */
export function AdjustmentForm() {
    return (
        <>
            <div className="warning-box">
                <p>No es obligatorio realizar ajustes. Este proceso puede ser omitido.</p>
            </div>

            <div className="form-group">
                <label htmlFor="property-select">Selecciona la propiedad</label>
                <select id="property-select" className="custom-select" onChange="renderAdjustments(this.selectedIndex)">
                    {/* Dinamically insert options with JS*/}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="adjustment-name">Concepto</label>
                <input type="text" id="adjustment-name" placeholder="Ej: Mantenimiento, Descuento por pronto pago" />
            </div>

            <div className="form-group">
                <label htmlFor="adjustment-amount">Valor</label>
                <input type="number" id="adjustment-amount" placeholder="$0.00" />
            </div>

            <div className="form-group">
                <label>Tipo</label>
                <div id="adjustment-radiobuttons" className="radio-group">
                    <label>
                        <input type="radio" name="adjustment-type" id="extra_charge" /> 
                        Cargo adicional
                    </label>
                    <label>
                        <input type="radio" name="adjustment-type" id="discount" /> 
                        Descuento
                    </label>
                </div>
            </div>

            <div className="form-group">
                <button className="button" id="add-adjustment-btn" onClick="manager.addAdjustment()">
                    Agregar ajuste
                </button>
            </div>

            <div className="table-wrapper">
                <table className="fixed-table" id="adjustments-table">
                    <thead>
                        <tr>
                            <th className="hidden" id="adjustmentTablePropertyName">Propiedad</th>
                            <th>Concepto</th>
                            <th>Valor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="empty-row" id="no-adjustments-row">
                            <td colSpan="3">No se han registrado ajustes para esta propiedad.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="btn-actions">
                <button className="button" onClick="prevStep()">Atrás</button>
                <button className="button" onClick="manager.liquidate()">Siguiente</button>
            </div>
        </>
    );
}
