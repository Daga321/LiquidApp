import { useState, useEffect } from "react";
import { MonetaryInput } from "../MonetaryInput/MonetaryInput.jsx";

/**
 * GeneralDataForm Component
 * Renders the form for general data input with validation support
 */
export function GeneralDataForm({ 
    invoiceData, 
    onUpdateInvoice, 
    errors = {}
}) {
    const [showCustomService, setShowCustomService] = useState(invoiceData.serviceOption === "Otro");
    const [showMeterInputs, setShowMeterInputs] = useState(invoiceData.singleMeter === false);

    // Update local state when invoiceData changes
    useEffect(() => {
        setShowCustomService(invoiceData.serviceOption === "Otro");
        setShowMeterInputs(invoiceData.singleMeter === false);
    }, [invoiceData.serviceOption, invoiceData.singleMeter]);

    const handleServiceChange = (e) => {
        const value = e.target.value;
        const isOther = value === "Otro";
        
        setShowCustomService(isOther);
        
        // Save the selected service option
        onUpdateInvoice("serviceOption", value);
        
        if (isOther) {
            onUpdateInvoice("serviceName", "");
        } else {
            onUpdateInvoice("serviceName", value);
        }
    };

    const handleMeterChange = (e) => {
        const isMultiple = e.target.value === "multiple-meter";
        const isSingle = e.target.value === "single-meter";
        setShowMeterInputs(isMultiple);
        onUpdateInvoice("singleMeter", isSingle);
    };

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Helper function to get tomorrow's date in YYYY-MM-DD format
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    // Helper function to get the day after a given date
    const getDayAfter = (dateString) => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    // Helper function to render error messages
    const renderError = (fieldName) => {
        if (errors[fieldName]) {
            return <div className="error-message">{errors[fieldName]}</div>;
        }
        return null;
    };

    return (
        <>
            <div className="form-group">
                <label>Tipo de servicio</label>
                <select 
                    className={`custom-select ${errors.serviceOption ? 'error' : ''}`} 
                    value={invoiceData.serviceOption || ""}
                    onChange={handleServiceChange}
                >
                    <option value="">Seleccione un servicio</option>
                    <option value="Agua">Agua + Aseo + Alcantarillado</option>
                    <option value="Gas">Gas</option>
                    <option value="Luz">Luz</option>
                    <option value="Otro">Otro</option>
                </select>
                {renderError('serviceOption')}
            </div>

            {showCustomService && (
                <div className="form-group">
                    <label>Ingrese el nombre del servicio</label>
                    <input 
                        type="text" 
                        value={invoiceData.serviceName}
                        onChange={(e) => onUpdateInvoice("serviceName", e.target.value)}
                        placeholder="Nombre del servicio"
                        className={errors.serviceName ? 'error' : ''}
                    />
                    {renderError('serviceName')}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="period-start">Inicio del periodo de facturación</label>
                <input 
                    type="date" 
                    id="period-start"
                    value={invoiceData.periodStart || ""}
                    onChange={(e) => onUpdateInvoice("periodStart", e.target.value)}
                    max={getTodayDate()} // Cannot be in the future
                    className={errors.periodStart ? 'error' : ''}
                />
                {renderError('periodStart')}
            </div>

            <div className="form-group">
                <label htmlFor="period-end">Fin del periodo de facturación</label>
                <input 
                    type="date" 
                    id="period-end"
                    value={invoiceData.periodEnd || ""}
                    onChange={(e) => onUpdateInvoice("periodEnd", e.target.value)}
                    min={invoiceData.periodStart ? invoiceData.periodStart : undefined} // Must be after period start
                    max={getTodayDate()} // Cannot be after today
                    className={errors.periodEnd ? 'error' : ''}
                />
                {renderError('periodEnd')}
            </div>

            <div className="form-group">
                <label htmlFor="due-date">Fecha límite de pago</label>
                <input 
                    type="date" 
                    id="due-date"
                    value={invoiceData.dueDate || ""}
                    onChange={(e) => onUpdateInvoice("dueDate", e.target.value)}
                    min={getDayAfter(invoiceData.periodEnd)} // Must be after period end
                    className={errors.dueDate ? 'error' : ''}
                />
                {renderError('dueDate')}
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
                            checked={invoiceData.singleMeter !== false}
                        />
                        Único
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="meter" 
                            value="multiple-meter" 
                            onChange={handleMeterChange}
                            checked={invoiceData.singleMeter === false}
                        />
                        Independientes internos
                    </label>
                </div>
            </div>

            {!showMeterInputs && (
                <div className="form-group">
                    <label htmlFor="invoice-value">Valor total del recibo</label>
                    <MonetaryInput
                        id="invoice-value" 
                        value={invoiceData.billValue || 0}
                        onChange={(value) => onUpdateInvoice("billValue", value)}
                        placeholder="$0.00"
                        className={errors.billValue ? 'error' : ''}
                    />
                    {renderError('billValue')}
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
                            className={errors.unit ? 'error' : ''}
                        />
                        {renderError('unit')}
                    </div>

                    <div className="form-group">
                        <label htmlFor="unit-cost">Costo por unidad</label>
                        <MonetaryInput
                            id="unit-cost" 
                            value={invoiceData.unitCost || 0}
                            onChange={(value) => onUpdateInvoice("unitCost", value)}
                            placeholder="$0.000"
                            className={errors.unitCost ? 'error' : ''}
                        />
                        {renderError('unitCost')}
                    </div>
                </>
            )}
        </>
    );
}
