import React from "react";
import { LiquidationMethodEnum } from "../../Models/Enums/LiquidationMethodEnum";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { IPropertiesFormProps } from "@/Types/Componets/IPropertiesFormProps";


/**
 * PropertiesForm Component
 * Renders the form for properties input
 */
export function PropertiesForm({ 
    formData,
    onFormDataChange,
    onAddProperty,
    errors = {},
    canAddProperty = false
}: IPropertiesFormProps) {
    const handleAddProperty = () => {
        if (!canAddProperty) {
            return;
        }
        onAddProperty();
    };

    return (
        <>
            <div className="form-group">
                <label htmlFor="property-name">Nombre del local/apartamento</label>
                <input 
                    type="text" 
                    id="property-name" 
                    placeholder="Ej: Local 1, Apto 101"
                    value={formData.propertyName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFormDataChange("propertyName", e.target.value)}
                    className={errors.propertyName ? 'error' : ''}
                />
                <ErrorMessage error={errors.propertyName} />
            </div>

            {formData.liquidationMethod?.Key !== LiquidationMethodEnum.CONSUMPTION.Key && (
                <div className="form-group">
                    <label>Método de liquidación</label>
                    <div className="radio-group">
                        <label>
                            <input 
                                type="radio" 
                                name="method" 
                                value={LiquidationMethodEnum.PERCENTAGE.Key}
                                checked={formData.liquidationMethod?.Key === LiquidationMethodEnum.PERCENTAGE.Key}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const selectedKey = e.target.value;
                                    const selectedMethod = Object.values(LiquidationMethodEnum).find(method => method.Key === selectedKey);
                                    onFormDataChange("liquidationMethod", selectedMethod || LiquidationMethodEnum.PERCENTAGE);
                                }}
                            /> 
                            {LiquidationMethodEnum.PERCENTAGE.Method}
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="method" 
                                value={LiquidationMethodEnum.PEOPLE.Key}
                                checked={formData.liquidationMethod?.Key === LiquidationMethodEnum.PEOPLE.Key}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const selectedKey = e.target.value;
                                    const selectedMethod = Object.values(LiquidationMethodEnum).find(method => method.Key === selectedKey);
                                    onFormDataChange("liquidationMethod", selectedMethod || LiquidationMethodEnum.PEOPLE);
                                }}
                            /> 
                            {LiquidationMethodEnum.PEOPLE.Method}
                        </label>
                    </div>
                    <ErrorMessage error={errors.liquidationMethod} />
                </div>
            )}

            <div className="form-group">
                <button 
                    className="button" 
                    type="button" 
                    onClick={handleAddProperty}
                    disabled={!canAddProperty}
                >
                    Agregar Propiedad
                </button>
            </div>
        </>
    );
}
