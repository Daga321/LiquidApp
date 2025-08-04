import React, { useRef, useEffect, useState } from "react";
import { DynamicTable } from "../DynamicTable/DynamicTable";
import { ColumnDefinition } from "../../../Types/components/DynamicTableTypes";
import { IProperty } from "../../../Types/Models/Property";
import { IResultsTableProps } from "../../../Types/components/IResultsComponentsProps";
import { AdjustmentTypeEnum } from "../../Models/Enums/AdjustmentTypeEnum";
import { IAdjustment } from "../../../Types/Models/Adjustment";
import "./ResultsTable.css";
import { LiquidationMethodEnum } from "../../Models/Enums/LiquidationMethodEnum";

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
     * Returns the appropriate class for adjustment values (only for the numeric part)
     * @param adjustment - The adjustment object
     * @returns Object with CSS class and sign
     */
    const getAdjustmentStyle = (adjustment: IAdjustment): { className: string; sign: string } => {
        if (adjustment.type.Key === AdjustmentTypeEnum.DISCOUNT.Key) {
            return { className: 'amount-credit', sign: '-' }; // Discount is favorable (green number)
        } else {
            return { className: 'amount-debt', sign: '+' }; // Extra charge is debt (red number)
        }
    };

    /**
     * Generates dots to fill space between adjustment description and value
     * This is now a simplified version that will be calculated dynamically per line
     * @param description - The adjustment description text
     * @param value - The formatted value string
     * @returns String of dots calculated to fill the available space
     */
    const generateDots = (description: string, value: string): string => {
        // Calculate approximate character count that would fit
        // This is a rough estimation - we'll let CSS handle the actual layout
        const maxLineLength = 130; // Approximate characters per line
        const usedSpace = description.length + value.length;
        const availableSpace = maxLineLength - usedSpace;
        
        return '.'.repeat(Math.max(availableSpace, 50));
    };

    /**
     * Renders a single row for the results table
     * @param property - The property data to render
     * @returns JSX element(s) representing the table row(s)
     */
    const renderRow = (property: IProperty) => {
        const rows = [];
        
        // Main property row
        const mainRow = (
            <tr key={`property-${property.name}`}>
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
            </tr>
        );
        
        rows.push(mainRow);
        
        // Adjustments row (if any)
        if (property.adjustmentsList && property.adjustmentsList.length > 0) {
            const adjustmentsRow = (
                <tr key={`adjustments-${property.name}`} className="adjustment-details-row">
                    <td colSpan={columns.length}>
                        <div>
                            {property.adjustmentsList.map((adjustment: IAdjustment, index: number) => {
                                const { className, sign } = getAdjustmentStyle(adjustment);
                                const valueText = `$${sign}${Math.abs(adjustment.value).toFixed(2)}`;
                                const dots = generateDots(`${adjustment.note}\u00A0\u00A0\u00A0`, valueText);

                                return (
                                    <div key={index} className="adjustment-line">
                                        <span className="adjustment-description">{`${adjustment.note}\u00A0\u00A0\u00A0`}</span>
                                        <span className="adjustment-dots">{dots}</span>
                                        <span className="adjustment-value">
                                            <span className={className}>$</span>
                                            <span className={className}>{sign}</span>
                                            <span className={className}>{Math.abs(adjustment.value).toFixed(2)}</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </tr>
            );
            rows.push(adjustmentsRow);
        }
        
        return rows;
    };

    return (
        <>
            <DynamicTable<IProperty>
                data={properties}
                columns={columns}
                renderRow={renderRow}
                withActions={false}
                allowMultipleRows={true}
            />
        </>
    );
}