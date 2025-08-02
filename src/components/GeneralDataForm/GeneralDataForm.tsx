import React, { useState, useEffect } from "react";
import { MonetaryInput } from "../MonetaryInput/MonetaryInput";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { IGeneralDataFormProps } from "../../Types/Componets/IGeneralDataFormProps";

/**
 * GeneralDataForm Component
 * Renders the form for general data input with validation support
 */
export function GeneralDataForm({ 
    invoiceData, 
    onUpdateInvoice, 
    errors = {}
}: IGeneralDataFormProps) {
    const [showCustomService, setShowCustomService] = useState((invoiceData as any).serviceOption === "Otro");
    const [showMeterInputs, setShowMeterInputs] = useState(invoiceData.singleMeter === false);

    // Update local state when invoiceData changes
    useEffect(() => {
        setShowCustomService((invoiceData as any).serviceOption === "Otro");
        setShowMeterInputs(invoiceData.singleMeter === false);
    }, [(invoiceData as any).serviceOption, invoiceData.singleMeter]);

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const isOther = value === "Otro";
        
        setShowCustomService(isOther);
        
        // Save the selected service option
        onUpdateInvoice("serviceOption" as any, value);
        
        if (isOther) {
            onUpdateInvoice("serviceName", "");
        } else {
            onUpdateInvoice("serviceName", value);
        }
    };

    const handleMeterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isMultiple = e.target.value === "multiple-meter";
        const isSingle = e.target.value === "single-meter";
        setShowMeterInputs(isMultiple);
        onUpdateInvoice("singleMeter", isSingle);
    };

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDate = (): string => {
        return new Date().toISOString().split('T')[0];
    };

    // Helper function to get the day before a given date
    const getDayBefore = (dateString: string): string | undefined => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    };

    // Helper function to get the day after a given date
    const getDayAfter = (dateString: string): string | undefined => {
        if (!dateString) return undefined;
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    return (
        <>
            <div className="form-group">
                <label>Tipo de servicio</label>
                <select 
                    className={`custom-select ${errors.serviceOption ? 'error' : ''}`} 
                    value={(invoiceData as any).serviceOption || ""}
                    onChange={handleServiceChange}
                >
                    <option value="">Seleccione un servicio</option>
                    <option value="Agua">Agua + Aseo + Alcantarillado</option>
                    <option value="Gas">Gas</option>
                    <option value="Luz">Luz</option>
                    <option value="Otro">Otro</option>
                </select>
                <ErrorMessage error={errors.serviceOption} />
            </div>

            {showCustomService && (
                <div className="form-group">
                    <label>Ingrese el nombre del servicio</label>
                    <input 
                        type="text" 
                        value={invoiceData.serviceName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateInvoice("serviceName", e.target.value)}
                        placeholder="Nombre del servicio"
                        className={errors.serviceName ? 'error' : ''}
                    />
                    <ErrorMessage error={errors.serviceName} />
                </div>
            )}

            <div className="form-group">
                <label htmlFor="period-start">Inicio del periodo de facturación</label>
                <input 
                    type="date" 
                    id="period-start"
                    value={invoiceData.periodStart ? invoiceData.periodStart.toString().split('T')[0] : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateInvoice("periodStart", e.target.value)}
                    max={getDayBefore(getTodayDate())} // Cannot be in the future
                    className={errors.periodStart ? 'error' : ''}
                />
                <ErrorMessage error={errors.periodStart} />
            </div>

            <div className="form-group">
                <label htmlFor="period-end">Fin del periodo de facturación</label>
                <input 
                    type="date" 
                    id="period-end"
                    value={invoiceData.periodEnd ? invoiceData.periodEnd.toString().split('T')[0] : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateInvoice("periodEnd", e.target.value)}
                    min={getDayAfter(invoiceData.periodStart ? invoiceData.periodStart.toString().split('T')[0] : "")} // Must be after period start
                    max={getTodayDate()} // Cannot be after today
                    className={errors.periodEnd ? 'error' : ''}
                />
                <ErrorMessage error={errors.periodEnd} />
            </div>

            <div className="form-group">
                <label htmlFor="due-date">Fecha límite de pago</label>
                <input 
                    type="date" 
                    id="due-date"
                    value={invoiceData.dueDate ? invoiceData.dueDate.toString().split('T')[0] : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateInvoice("dueDate", e.target.value)}
                    min={getDayAfter(invoiceData.periodEnd ? invoiceData.periodEnd.toString().split('T')[0] : "")} // Must be after period end
                    className={errors.dueDate ? 'error' : ''}
                />
                <ErrorMessage error={errors.dueDate} />
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
                        onChange={(value: number) => onUpdateInvoice("billValue", value)}
                        placeholder="$0.00"
                        className={errors.billValue ? 'error' : ''}
                    />
                    <ErrorMessage error={errors.billValue} />
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdateInvoice("unit", e.target.value)}
                            className={errors.unit ? 'error' : ''}
                        />
                        <ErrorMessage error={errors.unit} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="unit-cost">Costo por unidad</label>
                        <MonetaryInput
                            id="unit-cost" 
                            value={invoiceData.unitCost || 0}
                            onChange={(value: number) => onUpdateInvoice("unitCost", value)}
                            placeholder="$0.000"
                            className={errors.unitCost ? 'error' : ''}
                        />
                        <ErrorMessage error={errors.unitCost} />
                    </div>
                </>
            )}
        </>
    );
}
