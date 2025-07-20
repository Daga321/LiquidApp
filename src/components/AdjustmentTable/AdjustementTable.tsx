import { ColumnDefinition } from "../../Types/Componets/DynamicTableTypes";
import { DynamicTable } from "../DinamicTable/DynamicTable";
import { useStateContext } from "../../Utils/StateContext";
import { IAdjustmentTableProps } from "../../Types/Componets/IAdjustmentTableProps";

export function AdjustmentTable({ selectedPropertyId }: IAdjustmentTableProps) {
    const { data } = useStateContext();

    const columns: ColumnDefinition[] = [
        // { key: "property", title: "Propiedad", width: "200px" },
        { key: "details", title: "Concepto", width: "auto" },
        // { key: "type", title: "Tipo", width: "150px" },
        { key: "value", title: "Valor", width: "150px" }
    ];

    // Filter adjustments based on selected property
    const getAdjustmentsData = () => {
        const adjustmentsData: any[] = [];

        if (!selectedPropertyId) {
            <div className="message-box message-info">
                <p>Seleccione una propiedad para visualizar los datos.</p>
            </div>
        } else if (selectedPropertyId === "all") {
            // Show all adjustments grouped by property
            data.properties.forEach((property, propertyIndex) => {
                property.adjustmentsList.forEach((adjustment) => {
                    adjustmentsData.push({
                        property: property.name || `Propiedad ${propertyIndex + 1}`,
                        details: adjustment.note,
                        type: adjustment.type.Value,
                        value: `$${adjustment.value.toFixed(2)}`
                    });
                });
            });
        } else {
            // Show adjustments for selected property only
            const propertyIndex = parseInt(selectedPropertyId || "0");
            if (propertyIndex >= 0 && propertyIndex < data.properties.length) {
                const property = data.properties[propertyIndex];
                property.adjustmentsList.forEach((adjustment) => {
                    adjustmentsData.push({
                        property: property.name || `Propiedad ${propertyIndex + 1}`,
                        details: adjustment.note,
                        type: adjustment.type.Value,
                        value: `$${adjustment.value.toFixed(2)}`
                    });
                });
            }
        }

        return adjustmentsData;
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Ajustes Agregados</h3>

            <DynamicTable
                columns={columns}
                data={getAdjustmentsData()}
                renderRow={(item: any) => (
                    <>
                        {/* <td>{item.property}</td> */}
                        <td>{item.details}</td>
                        {/* <td>{item.type}</td> */}
                        <td style={{ textAlign: "right" }}>{item.value}</td>
                    </>
                )}
                withActions={true}
                actionPosition="end"
            />

        </div>
    );
}