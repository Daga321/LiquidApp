import { IPropertySelectorProps } from "../../../Types/components/IPropertySelectorProps";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

/**
 * PropertySelector Component
 * Renders a dropdown to select a property from a list of properties
 */
export function PropertySelector({ 
    properties, 
    selectedPropertyId, 
    onPropertyChange,
    disabled = false,
    errors,
    includeAllOption = false
}: IPropertySelectorProps) {
    return (
        <div className="form-group">
            <label htmlFor="property-select">Selecciona la propiedad</label>
            <select 
                id="property-select" 
                className="custom-select" 
                value={selectedPropertyId}
                onChange={(e) => onPropertyChange(e.target.value)}
                disabled={disabled}
            >
                <option value="">Seleccione una propiedad</option>
                {properties.map((property, index) => (
                    <option key={index} value={index.toString()}>
                        {property.name || `Propiedad ${index + 1}`}
                    </option>
                ))}
                {includeAllOption && (
                    <option value="all">Todas las propiedades</option>
                )}
            </select>
            <ErrorMessage error={errors.selectedPropertyId} />
        </div>
    );
}
