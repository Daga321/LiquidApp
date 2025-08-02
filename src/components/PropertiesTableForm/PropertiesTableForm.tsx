import { IProperty } from "@/Types/Models/Property";
import { LiquidationMethodEnum } from "../../Models/Enums/LiquidationMethodEnum";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { DynamicTable } from "../DynamicTable/DynamicTable";
import { ColumnDefinition, ActionType } from "../../Types/Componets/DynamicTableTypes";

interface PropertiesTableFormProps {
    properties: IProperty[];
    onPropertyChange: (index: number, field: keyof IProperty, value: any) => void;
    onPropertyAction: (action: ActionType, property: IProperty) => void;
    errors?: { [key: string]: string };
}

export function PropertiesTableForm({ 
    properties, 
    onPropertyChange, 
    onPropertyAction,
    errors = {} 
}: PropertiesTableFormProps) {
    
    // Definir las columnas de la tabla
    const columns: ColumnDefinition[] = [
        { key: "name", title: "Nombre", width: "300px" },
        { key: "baseValue", title: "Valor Base", width: "300px" }
    ];

    // Manejar las acciones de la tabla
    const handleAction = (action: ActionType, property: IProperty) => {
        onPropertyAction(action, property);
    };

    // Renderizar cada fila de la tabla
    const renderRow = (property: IProperty, skipGroupColumn?: boolean) => {
        const propertyIndex = properties.findIndex(p => p.name === property.name && p.method.Key === property.method.Key);
        
        // Obtener el error específico para esta propiedad
        const errorKey = `property_${propertyIndex}_value`;
        const errorMessage = errors[errorKey] || null;
        
        return (
            <>
                <td>{property.name}</td>
                
                <td>
                    <input 
                        type="number"
                        value={property.baseValue > 0 ? property.baseValue : ''} 
                        placeholder={property.method.InputPlaceHolder}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Validar según el método de liquidación
                            if (value === '') {
                                onPropertyChange(propertyIndex, 'baseValue', 0);
                            } else if (/^\d+$/.test(value)) {
                                const numValue = parseInt(value);
                                if (numValue > 0) {
                                    // Para porcentajes, no permitir valores > 100
                                    if (property.method.Key === 'PERCENTAGE' && numValue <= 100) {
                                        onPropertyChange(propertyIndex, 'baseValue', numValue);
                                    } else if (property.method.Key !== 'PERCENTAGE') {
                                        onPropertyChange(propertyIndex, 'baseValue', numValue);
                                    }
                                }
                            }
                        }}
                        className={errorMessage ? 'error' : ''}
                        style={{ width: '100%' }}
                        min="1"
                        max={property.method.Key === 'PERCENTAGE' ? "100" : undefined}
                        step="1"
                    />
                    {errorMessage && <ErrorMessage error={errorMessage} />}
                </td>
            </>
        );
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Propiedades Agregadas</h3>
            <DynamicTable
                data={properties}
                columns={columns}
                renderRow={renderRow}
                withActions={true}
                onAction={handleAction}
                actionPosition="end"
            />
        </div>
    );
}