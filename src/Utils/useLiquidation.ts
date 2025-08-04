import { useStateContext } from "./StateContext";
import { LiquidationMethodEnum } from "../Models/Enums/LiquidationMethodEnum";
import { AdjustmentTypeEnum } from "../Models/Enums/AdjustmentTypeEnum";
import { IProperty } from "../../Types/Models/Property";

/**
 * Custom hook for handling liquidation calculations
 * Manages the calculation logic for property liquidations based on invoice data
 */
export const useLiquidation = () => {
    const { data, updateProperty, updateInvoice } = useStateContext();

    /**
     * Performs liquidation calculation for all properties
     * Updates the properties using updateProperty helper
     */
    function performLiquidation(): void {
        const { invoice, properties } = data;
        
        // Calculate value per person first
        const totalPercentageUsed = properties
            .filter(p => p.method.Key === LiquidationMethodEnum.PERCENTAGE.Key)
            .reduce((sum, p) => sum + p.baseValue, 0);
        
        const remainingPercentage = 100 - totalPercentageUsed;
        const remainingAmount = invoice.billValue * remainingPercentage / 100;
        
        const totalPeople = properties
            .filter(p => p.method.Key === LiquidationMethodEnum.PEOPLE.Key)
            .reduce((sum, p) => sum + p.baseValue, 0);
        
        const calculatedValuePerPeople = totalPeople > 0 ? remainingAmount / totalPeople : 0;
        
        // Update the invoice with the calculated value per person
        updateInvoice('valuePerPeople', calculatedValuePerPeople);
        
        properties.forEach((property: IProperty, index: number) => {
            let amountToPay = 0;
            let adjustmentValue = 0;

            // Calculate base amount based on liquidation method
            switch (property.method.Key) {
                case LiquidationMethodEnum.PERCENTAGE.Key:
                    amountToPay = invoice.billValue * property.baseValue / 100;
                    break;
                case LiquidationMethodEnum.PEOPLE.Key:
                    amountToPay = invoice.valuePerPeople * property.baseValue;
                    break;
                case LiquidationMethodEnum.CONSUMPTION.Key:
                    amountToPay = invoice.unitCost * property.baseValue;
                    break;
                default:
                    amountToPay = 0;
            }

            // Calculate adjustments
            for (const adjustment of property.adjustmentsList) {
                if (adjustment.type.Key === AdjustmentTypeEnum.DISCOUNT.Key) {
                    adjustmentValue -= adjustment.value;
                } else if (adjustment.type.Key === AdjustmentTypeEnum.EXTRA_CHARGE.Key) {
                    adjustmentValue += adjustment.value;
                }
            }

            const totalToPay = amountToPay + adjustmentValue;

            // Update properties using the helper
            updateProperty(index, 'amountToPay', amountToPay);
            updateProperty(index, 'adjustmentValue', adjustmentValue);
            updateProperty(index, 'totalToPay', totalToPay);
        });
    }

    // No side effects, calculation is now pure and can be used with useMemo

    return {
        performLiquidation
    };
};
