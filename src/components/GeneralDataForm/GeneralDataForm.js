/**
 * GeneralDataForm Component
 * Renders the form for general data input
 */
export function GeneralDataForm() {
    return (
        <>
            <div className="form-group">
                <label>Tipo de servicio</label>
                <select id="service-name-select" className="custom-select" onChange="toggleServiceInput()">
                    <option value="agua">Agua + Aseo + Alcantarillado</option>
                    <option value="gas">Gas</option>
                    <option value="luz">Luz</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            <div className="hidden" id="collection-service-name">
                <label>Ingrese el nombre del servicio</label>
                <input type="text" id="service-name-input" />
            </div>

            <div className="form-group">
                <label htmlFor="billing-period-start">Inicio del periodo de facturación</label>
                <input type="date" id="billing-period-start" />
            </div>

            <div className="form-group">
                <label htmlFor="billing-period-end">Fin del periodo de facturación</label>
                <input type="date" id="billing-period-end" />
            </div>

            <div className="form-group">
                <label htmlFor="due-date">Fecha límite de pago</label>
                <input type="date" id="due-date" />
            </div>

            <div className="form-group">
                <label>Contador</label>
                <div className="radio-group">
                    <label>
                        <input type="radio" id="single-meter" name="meter" value="single-meter" onClick="toggleMeterInputs()" defaultChecked />
                        Único
                    </label>
                    <label>
                        <input type="radio" id="multiple-meter" name="meter" value="multiple-meter" onClick="toggleMeterInputs()" />
                        Independientes internos
                    </label>
                </div>
            </div>

            <div className="form-group" id="invoice-value-collection">
                <label htmlFor="invoice-value">Valor total del recibo</label>
                <input type="number" min="1" id="invoice-value" placeholder="$0.00" />
            </div>

            <div className="hidden" id="collection-unit">
                <label htmlFor="unit">Unidad de cobro (Ej: m³, kWh, etc.)</label>
                <input type="text" id="unit" placeholder="Ej: m³" />
            </div>

            <div className="hidden" id="unit-cost">
                <label htmlFor="service-amount">Costo por unidad</label>
                <input type="number" min="1" id="service-amount" placeholder="$0.000" />
            </div>

            <div className="btn-actions">
                <button className="button" id="GeneralData-NextButton" onClick="manager.setGeneralDataValue()">
                    Siguiente
                </button>
            </div>
        </>
    );
}
