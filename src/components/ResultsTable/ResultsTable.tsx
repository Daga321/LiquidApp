import { DynamicTable } from "../DinamicTable/DynamicTable";
import { ColumnDefinition } from "../../Types/Componets/DynamicTableTypes";
import { IProperty } from "../../Types/Models/Property";
import { IResultsTableProps } from "../../Types/Componets/IResultsComponentsProps";
import "./ResultsTable.css";
import LiquidationMethodEnum from "@/Models/Enums/LiquidationMethodEnum";

export function ResultsTable({ properties }: IResultsTableProps){

    // Column definitions for the results table
    const columns: ColumnDefinition[] = [
        { key: "name", title: "Propiedad", align: "center" },
        { key: "method", title: "Método de liquidación", align: "center" },
        { key: "baseValue", title: "Valor base", align: "center" },
        { key: "amountToPay", title: "Consumo liquidado", align: "center" },
        { key: "adjustmentValue", title: "Ajustes", align: "center" },
        { key: "totalToPay", title: "Total", align: "center" }
    ];

    /**
     * Returns the appropriate CSS class based on the value for billing context
     * @param value - The numeric value to evaluate
     * @returns CSS class name
     */
    const getAmountColorClass = (value: number): string => {
        if (value > 0) return 'amount-debt';      // Red - amount owed
        if (value < 0) return 'amount-credit';    // Green - credit/favorable balance
        return 'amount-zero';                     // Black - zero amount
    };

    /**
     * Renders a single row for the results table
     * @param property - The property data to render
     * @returns JSX element representing the table row
     */
    const renderRow = (property: IProperty) => {
        return (
            <>
                <td>{property.name}</td>
                <td style={{ textAlign: 'center' }}>{property.method.Method}</td>
                <td style={{ textAlign: 'center' }}>
                    {property.method.Key === LiquidationMethodEnum.PERCENTAGE.Key
                        ? `${property.baseValue}%` 
                        : property.baseValue.toString()
                    }
                </td>
                <td style={{ textAlign: 'center' }} className={getAmountColorClass(property.amountToPay)}>
                    ${property.amountToPay.toFixed(2)}
                </td>
                <td style={{ textAlign: 'center' }} className={getAmountColorClass(property.adjustmentValue)}>
                    ${property.adjustmentValue.toFixed(2)}
                </td>
                <td style={{ textAlign: 'center' }} className={getAmountColorClass(property.totalToPay)}>
                    <strong>${property.totalToPay.toFixed(2)}</strong>
                </td>
            </>
        );
    };

    return (
        <>
            <DynamicTable<IProperty>
                data={properties}
                columns={columns}
                renderRow={renderRow}
                withActions={false}
            />
        </>
    );
}