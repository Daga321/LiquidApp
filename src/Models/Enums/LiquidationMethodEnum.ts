import { ILiquidationMethodEnum } from '../../../Types/Models/Enums/LiquidationMethodEnum';

/**
 * Enum to define available liquidation methods.
 */
export const LiquidationMethodEnum: ILiquidationMethodEnum = {
    CONSUMPTION: {
        Key: "CONSUMPTION",
        Method: "Por consumo",
        InputPlaceHolder: "Unidades consumidas"
    },
    PERCENTAGE: {
        Key: "PERCENTAGE",
        Method: "Por porcentaje",
        InputPlaceHolder: "Porcentaje asignado"
    },
    PEOPLE: {
        Key: "PEOPLE",
        Method: "Por número de personas",
        InputPlaceHolder: "Número de personas"
    }
} as const;

export default LiquidationMethodEnum;
