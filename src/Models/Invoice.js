/**
 * Represents an invoice with service details and billing information.
 */
class Invoice {
    /**
     * @param {string} serviceName - The name of the service being billed.
     * @param {number} billValue - The total value of the bill.
     * @param {number} valuePerPeople - The value per person for the service.
     * @param {string} unit - The unit of measurement for the service.
     * @param {Date} periodStart - The start date of the billing period.
     * @param {Date} periodEnd - The end date of the billing period.
     * @param {Date} dueDate - The due date for payment.
     * @param {number} unitCost - The cost per unit of the service.
     * @param {boolean} singleMeter - Whether the service uses a single meter.
     */
    constructor(serviceName, billValue, valuePerPeople, unit, periodStart, periodEnd, dueDate, unitCost, singleMeter) {
        this._serviceName = serviceName;
        this._billValue = billValue;
        this._valuePerPeople = valuePerPeople;
        this._unit = unit;
        this._periodStart = periodStart;
        this._periodEnd = periodEnd;
        this._dueDate = dueDate;
        this._unitCost = unitCost;
        this._singleMeter = singleMeter;
    }

    /**
     * Get the service name.
     * @returns {string} The name of the service.
     */
    get serviceName() {
        return this._serviceName;
    }

    /**
     * Set the service name.
     * @param {string} value - The name of the service.
     */
    set serviceName(value) {
        this._serviceName = value;
    }

    /**
     * Get the bill value.
     * @returns {number} The total value of the bill.
     */
    get billValue() {
        return this._billValue;
    }

    /**
     * Set the bill value.
     * @param {number} value - The total value of the bill.
     */
    set billValue(value) {
        this._billValue = value;
    }

    /**
     * Get the value per people.
     * @returns {number} The value per person for the service.
     */
    get valuePerPeople() {
        return this._valuePerPeople;
    }

    /**
     * Set the value per people.
     * @param {number} value - The value per person for the service.
     */
    set valuePerPeople(value) {
        this._valuePerPeople = value;
    }

    /**
     * Get the unit of measurement.
     * @returns {string} The unit of measurement for the service.
     */
    get unit() {
        return this._unit;
    }

    /**
     * Set the unit of measurement.
     * @param {string} value - The unit of measurement for the service.
     */
    set unit(value) {
        this._unit = value;
    }

    /**
     * Get the period start date.
     * @returns {Date} The start date of the billing period.
     */
    get periodStart() {
        return this._periodStart;
    }

    /**
     * Set the period start date.
     * @param {Date} value - The start date of the billing period.
     */
    set periodStart(value) {
        this._periodStart = value;
    }

    /**
     * Get the period end date.
     * @returns {Date} The end date of the billing period.
     */
    get periodEnd() {
        return this._periodEnd;
    }

    /**
     * Set the period end date.
     * @param {Date} value - The end date of the billing period.
     */
    set periodEnd(value) {
        this._periodEnd = value;
    }

    /**
     * Get the due date.
     * @returns {Date} The due date for payment.
     */
    get dueDate() {
        return this._dueDate;
    }

    /**
     * Set the due date.
     * @param {Date} value - The due date for payment.
     */
    set dueDate(value) {
        this._dueDate = value;
    }

    /**
     * Get the unit cost.
     * @returns {number} The cost per unit of the service.
     */
    get unitCost() {
        return this._unitCost;
    }

    /**
     * Set the unit cost.
     * @param {number} value - The cost per unit of the service.
     */
    set unitCost(value) {
        this._unitCost = value;
    }

    /**
     * Get the single meter flag.
     * @returns {boolean} Whether the service uses a single meter.
     */
    get singleMeter() {
        return this._singleMeter;
    }

    /**
     * Set the single meter flag.
     * @param {boolean} value - Whether the service uses a single meter.
     */
    set singleMeter(value) {
        this._singleMeter = value;
    }
}

module.exports = Invoice;
