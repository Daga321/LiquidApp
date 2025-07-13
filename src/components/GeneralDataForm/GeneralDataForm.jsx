import { useState } from "react";

/**
 * GeneralDataForm Component
 * Renders the form for general data input
 */
export function GeneralDataForm({ invoiceData, onUpdateInvoice }) {
    const [showCustomService, setShowCustomService] = useState(false);
    const [showMeterInputs, setShowMeterInputs] = useState(false);

    const handleServiceChange = (e) => {
        const value = e.target.value;
        if (value === "Otro") {
            setShowCustomService(true);
            onUpdateInvoice("serviceName", "");
        } else {
            setShowCustomService(false);
            onUpdateInvoice("serviceName", value);
        }
    };

    const handleMeterChange = (e) => {
        const isMultiple = e.target.value === "multiple-meter";
        setShowMeterInputs(isMultiple);
    };

    return (
        <>
            <div className="form-group">
                <label>Tipo de servicio</label>
                <select className="custom-select" onChange={handleServiceChange}>
                    <option value="">Seleccione un servicio</option>
                    <option value="Agua">Agua + Aseo + Alcantarillado</option>
                    <option value="Gas">Gas</option>
                    <option value="Luz">Luz</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            {showCustomService && (
                <div className="form-group">
                    <label>Ingrese el nombre del servicio</label>
                    <input 
                        type="text" 
                        value={invoiceData.serviceName}
                        onChange={(e) => onUpdateInvoice("serviceName", e.target.value)}
                        placeholder="Nombre del servicio"
                    />
                </div>
            )}

            <div className="form-group">
                <label htmlFor="period-start">Inicio del periodo de facturación</label>
                <input 
                    type="date" 
                    id="period-start"
                    value={invoiceData.periodStart || ""}
                    onChange={(e) => onUpdateInvoice("periodStart", e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="period-end">Fin del periodo de facturación</label>
                <input 
                    type="date" 
                    id="period-end"
                    value={invoiceData.periodEnd || ""}
                    onChange={(e) => onUpdateInvoice("periodEnd", e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="due-date">Fecha límite de pago</label>
                <input 
                    type="date" 
                    id="due-date"
                    value={invoiceData.dueDate || ""}
                    onChange={(e) => onUpdateInvoice("dueDate", e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Contador</label>
                <div className="radio-group">
                    <label>
                        <input 
                            type="radio" 
                            name="meter" 
                            value="single-meter" 
                            onChange={handleMeterChange}
                            defaultChecked 
                        />
                        Único
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="meter" 
                            value="multiple-meter" 
                            onChange={handleMeterChange}
                        />
                        Independientes internos
                    </label>
                </div>
            </div>

            {!showMeterInputs && (
                <div className="form-group">
                    <label htmlFor="invoice-value">Valor total del recibo</label>
                    <input 
                        type="number" 
                        min="1" 
                        id="invoice-value" 
                        placeholder="$0.00"
                        value={invoiceData.billValue || ""}
                        onChange={(e) => onUpdateInvoice("billValue", parseFloat(e.target.value) || 0)}
                    />
                </div>
            )}

            {showMeterInputs && (
                <>
                    <div className="form-group">
                        <label htmlFor="unit">Unidad de cobro (Ej: m³, kWh, etc.)</label>
                        <input 
                            type="text" 
                            id="unit" 
                            placeholder="Ej: m³"
                            value={invoiceData.unit || ""}
                            onChange={(e) => onUpdateInvoice("unit", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="unit-cost">Costo por unidad</label>
                        <input 
                            type="number" 
                            min="1" 
                            id="unit-cost" 
                            placeholder="$0.000"
                            value={invoiceData.unitCost || ""}
                            onChange={(e) => onUpdateInvoice("unitCost", parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </>
            )}
        </>
    );
}
