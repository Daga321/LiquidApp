/**
 * Represents an invoice with service details and billing information.
 */
class Invoice {
    /**
     * @param {string} serviceName - The name of the service being billed.
     * @param {number} billValue - The total value of the bill.
     * @param {number} valuePerPeople - The value per person for the service.
     * @param {number} servicesAmount - The value per unit of the services consumed.
     */
    constructor(serviceName, billValue, valuePerPeople, servicesAmount) {
        this._serviceName = serviceName;
        this._billValue = billValue;
        this._valuePerPeople = valuePerPeople;
        this._servicesAmount = servicesAmount;
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
     * Get the services amount.
     * @returns {number} The total amount of services consumed.
     */
    get servicesAmount() {
        return this._servicesAmount;
    }

    /**
     * Set the services amount.
     * @param {number} value - The total amount of services consumed.
     */
    set servicesAmount(value) {
        this._servicesAmount = value;
    }
}

module.exports = Invoice;
