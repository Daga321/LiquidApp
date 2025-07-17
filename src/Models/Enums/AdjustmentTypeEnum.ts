import { IAdjustmentTypeEnum } from '../../Types/Models/Enums/AdjustmentTypeEnum';

/**
 * Enum to define available adjustment types.
 */
export const AdjustmentTypeEnum: IAdjustmentTypeEnum = {
    DISCOUNT: { Key: "DISCOUNT", Value: "Discount" },
    EXTRA_CHARGE: { Key: "EXTRA_CHARGE", Value: "Extra charge" }
} as const;

export default AdjustmentTypeEnum;
