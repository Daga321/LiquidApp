/**
 * Represents a property with a billing method and potential monetary adjustments.
 */
class Property {
    /**
     * @param {string} name - The property name.
     * @param {Object} method - The liquidation method used.
     */
    constructor(name, method) {
        this._name = name;
        this._method = method;

        this._baseValue = 0;
        this._amountToPay = 0;
        this._adjustmentValue = 0;
        this._totalToPay = 0;

        /** @type {Adjustment[]} */
        this._adjustmentsList = [];
    }

    // Getters and setters with encapsulation
    get name() {
        return this._name;
    }

    set name(val) {
        this._name = val;
    }

    get method() {
        return this._method;
    }

    set method(val) {
        this._method = val;
    }

    get baseValue() {
        return this._baseValue;
    }

    set baseValue(val) {
        this._baseValue = val;
    }

    get amountToPay() {
        return this._amountToPay;
    }

    get adjustmentValue() {
        return this._adjustmentValue;
    }

    get totalToPay() {
        return this._totalToPay;
    }

    get adjustmentsList() {
        return this._adjustmentsList;
    }

    /**
     * Add a valid Adjustment object to the property.
     * @param {Adjustment} adjustment 
     */
    addAdjustment(adjustment) {
        if (!(adjustment instanceof Adjustment)) {
            throw new TypeError("Only instances of Adjustment are allowed.");
        }
        this._adjustmentsList.push(adjustment);
    }

    /**
     * Remove an adjustment from the list.
     * @param {Adjustment} adjustment 
     */
    removeAdjustment(adjustment) {
        this._adjustmentsList = this._adjustmentsList.filter(a => a !== adjustment);
    }

    /**
     * Calculates the amount to pay based on the billing method and adjustments.
     * @param {number} billValue - Total billing value.
     * @param {number} valuePerPerson - Unit value per person.
     * @param {number} servicesAmount - Total consumption or usage.
     */
    liquidate(billValue, valuePerPerson, servicesAmount) {
        this._amountToPay = 0;
        this._adjustmentValue = 0;
        this._totalToPay = 0;

        switch (this._method) {
            case LiquidationMethodEnum.PERCENTAGE:
                this._amountToPay = (billValue * this._baseValue) / 100;
                break;
            case LiquidationMethodEnum.PEOPLE:
                this._amountToPay = valuePerPerson * this._baseValue;
                break;
            case LiquidationMethodEnum.CONSUMPTION:
                this._amountToPay = servicesAmount * this._baseValue;
                break;
            default:
                throw new Error("Unknown liquidation method.");
        }

        for (const adjustment of this._adjustmentsList) {
            if (adjustment.type === AdjustmentTypeEnum.DISCOUNT) {
                this._adjustmentValue -= adjustment.value;
            } else if (adjustment.type === AdjustmentTypeEnum.EXTRA_CHARGE) {
                this._adjustmentValue += adjustment.value;
            }
        }

        this._totalToPay = this._amountToPay + this._adjustmentValue;
    }
}
