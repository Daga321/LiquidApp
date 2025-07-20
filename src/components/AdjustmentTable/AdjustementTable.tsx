import { ColumnDefinition, ActionType } from "../../Types/Componets/DynamicTableTypes";
import { DynamicTable } from "../DinamicTable/DynamicTable";
import { useStateContext } from "../../Utils/StateContext";
import { IAdjustmentTableProps } from "../../Types/Componets/IAdjustmentTableProps";
import { AdjustmentTypeEnum } from "../../Models/Enums/AdjustmentTypeEnum";

export function AdjustmentTable({ selectedPropertyId }: IAdjustmentTableProps) {
    const { data, removeAdjustment, moveAdjustment } = useStateContext();

    // Define columns based on whether we're showing all properties or just one
    const getColumns = (): ColumnDefinition[] => {
        if (selectedPropertyId === "all") {
            return [
                { key: "property", title: "Propiedad", width: "200px" },
                { key: "details", title: "Concepto", width: "auto" },
                { key: "value", title: "Valor", width: "150px" }
            ];
        } else {
            return [
                { key: "details", title: "Concepto", width: "auto" },
                { key: "value", title: "Valor", width: "150px" }
            ];
        }
    };

    // Filter adjustments based on selected property
    const getAdjustmentsData = () => {
        const adjustmentsData: any[] = [];

        if (!selectedPropertyId) {
            return adjustmentsData;
        } else if (selectedPropertyId === "all") {
            // Show all adjustments grouped by property
            data.properties.forEach((property, propertyIndex) => {
                property.adjustmentsList.forEach((adjustment, adjustmentIndex) => {
                    const isDiscount = adjustment.type.Key === AdjustmentTypeEnum.DISCOUNT.Key;
                    const displayValue = isDiscount ? adjustment.value : -adjustment.value;
                    
                    adjustmentsData.push({
                        property: property.name || `Propiedad ${propertyIndex + 1}`,
                        propertyIndex: propertyIndex,
                        adjustmentIndex: adjustmentIndex,
                        details: adjustment.note,
                        type: adjustment.type.Value,
                        value: displayValue,
                        isDiscount: isDiscount
                    });
                });
            });
        } else {
            // Show adjustments for selected property only
            const propertyIndex = parseInt(selectedPropertyId || "0");
            if (propertyIndex >= 0 && propertyIndex < data.properties.length) {
                const property = data.properties[propertyIndex];
                property.adjustmentsList.forEach((adjustment, adjustmentIndex) => {
                    const isDiscount = adjustment.type.Key === AdjustmentTypeEnum.DISCOUNT.Key;
                    const displayValue = isDiscount ? adjustment.value : -adjustment.value;
                    
                    adjustmentsData.push({
                        property: property.name || `Propiedad ${propertyIndex + 1}`,
                        propertyIndex: propertyIndex,
                        adjustmentIndex: adjustmentIndex,
                        details: adjustment.note,
                        type: adjustment.type.Value,
                        value: displayValue,
                        isDiscount: isDiscount
                    });
                });
            }
        }

        return adjustmentsData;
    };

    // Handle actions for adjustments
    const handleAction = (action: ActionType, item: any) => {
        const { propertyIndex, adjustmentIndex } = item;
        const property = data.properties[propertyIndex];
        const adjustments = property.adjustmentsList;
        
        switch (action) {
            case "up":
                if (adjustmentIndex > 0) {
                    // Move up within the same property
                    moveAdjustment(propertyIndex, adjustmentIndex, adjustmentIndex - 1);
                }
                break;
                
            case "down":
                if (adjustmentIndex < adjustments.length - 1) {
                    // Move down within the same property
                    moveAdjustment(propertyIndex, adjustmentIndex, adjustmentIndex + 1);
                }
                break;
                
            case "delete":
                removeAdjustment(propertyIndex, adjustmentIndex);
                break;
                
            case "edit":
                console.log("Edit adjustment:", item);
                break;
        }
    };

    // Render row for grouped view (when showing all properties)
    const renderGroupedRow = (item: any, skipGroupColumn?: boolean) => (
        <>
            {!skipGroupColumn && (
                <td>{item.property}</td>
            )}
            <td>{item.details}</td>
            <td 
                style={{ 
                    textAlign: "right",
                    color: item.isDiscount ? "var(--color-success)" : "var(--color-danger)",
                    fontWeight: "bold"
                }}
            >
                ${item.value.toFixed(2)}
            </td>
        </>
    );

    // Render row for single property view
    const renderSingleRow = (item: any) => (
        <>
            <td>{item.details}</td>
            <td 
                style={{ 
                    textAlign: "right",
                    color: item.isDiscount ? "var(--color-success)" : "var(--color-danger)",
                    fontWeight: "bold"
                }}
            >
                ${item.value.toFixed(2)}
            </td>
        </>
    );

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Ajustes Agregados</h3>

            {selectedPropertyId === "all" ? (
                <DynamicTable
                    columns={getColumns()}
                    data={getAdjustmentsData()}
                    renderRow={renderGroupedRow}
                    withActions={true}
                    onAction={handleAction}
                    groupBy="property"
                    actionPosition="end"
                />
            ) : (
                <DynamicTable
                    columns={getColumns()}
                    data={getAdjustmentsData()}
                    renderRow={renderSingleRow}
                    withActions={true}
                    onAction={handleAction}
                    actionPosition="end"
                />
            )}
        </div>
    );
}