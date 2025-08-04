import { IAdjustmentTypeEnum } from '../../../Types/Models/Enums/AdjustmentTypeEnum';

/**
 * Enum to define available adjustment types.
 */
export const AdjustmentTypeEnum: IAdjustmentTypeEnum = {
    DISCOUNT: { Key: "DISCOUNT", Value: "Descuento" },
    EXTRA_CHARGE: { Key: "EXTRA_CHARGE", Value: "Cargo adicional" }
} as const;

export default AdjustmentTypeEnum;
