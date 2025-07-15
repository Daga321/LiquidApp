import { LiquidationMethodEnum } from "../../Models/Enums/LiquidationMethodEnum.js";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage.jsx";

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
}) {
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
                    onChange={(e) => onFormDataChange("propertyName", e.target.value)}
                    className={errors.propertyName ? 'error' : ''}
                />
                <ErrorMessage error={errors.propertyName} />
            </div>

            {formData.liquidationMethod !== LiquidationMethodEnum.CONSUMPTION.Key && (
                <div className="form-group">
                <label>Método de liquidación</label>
                <div className="radio-group">
                    <label>
                        <input 
                            type="radio" 
                            name="method" 
                            value={LiquidationMethodEnum.PERCENTAGE.Key}
                            checked={formData.liquidationMethod === LiquidationMethodEnum.PERCENTAGE.Key}
                            onChange={(e) => onFormDataChange("liquidationMethod", e.target.value)}
                        /> 
                        {LiquidationMethodEnum.PERCENTAGE.Method}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="method" 
                            value={LiquidationMethodEnum.PEOPLE.Key}
                            checked={formData.liquidationMethod === LiquidationMethodEnum.PEOPLE.Key}
                            onChange={(e) => onFormDataChange("liquidationMethod", e.target.value)}
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
