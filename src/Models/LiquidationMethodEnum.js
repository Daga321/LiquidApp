/**
 * Enum to define available liquidation methods.
 */
class LiquidationMethodEnum {
    static CONSUMPTION = {
        Key: "CONSUMPTION",
        Method: "By consumption",
        InputPlaceHolder: "Units consumed"
    };
    static PERCENTAGE = {
        Key: "PERCENTAGE",
        Method: "By percentage",
        InputPlaceHolder: "Assigned percentage"
    };
    static PEOPLE = {
        Key: "PEOPLE",
        Method: "By number of people",
        InputPlaceHolder: "Number of people"
    };
}
