import validator from 'validator';
import { ValidationBase } from './ValidationBase.js';

/**
 * Specific validation for general data form
 */
export class GeneralDataValidation extends ValidationBase {
  constructor() {
    super();
  }

  /**
   * Validates all fields in the general data form
   * @param {Object} data - Invoice data object
   * @param {Object} uiState - UI state for conditional validations
   * @returns {Object} Validation result
   */
  validate(data, uiState = {}) {
    this.clearErrors();
    let isValid = true;

    // Validate service name if it's "Other"
    if (uiState.serviceNameOption === "Otro") {
      if (!this.validateRequired(data.serviceName, 'serviceName', 'Enter the service name')) {
        isValid = false;
      }
    }

    // Required date validations
    if (!this.validateRequired(data.periodStart, 'periodStart', 'Enter the period start date')) {
      isValid = false;
    }

    if (!this.validateRequired(data.periodEnd, 'periodEnd', 'Enter the period end date')) {
      isValid = false;
    }

    if (!this.validateRequired(data.dueDate, 'dueDate', 'Select the payment due date')) {
      isValid = false;
    }

    // Validate date logic
    if (!this.validateDateLogic(data)) {
      isValid = false;
    }

    // Conditional validations based on meter type
    if (uiState.meterType === 'single') {
      // Single meter - validate bill value
      if (!this.validateMinNumber(data.billValue, 'billValue', 1, 'Must be a number greater than or equal to 1')) {
        isValid = false;
      }
    } else if (uiState.meterType === 'multiple') {
      // Multiple meter - validate unit and unit cost
      if (!this.validateRequired(data.unit, 'unit', 'Specify the billing unit')) {
        isValid = false;
      }

      if (!this.validateMinNumber(data.unitCost, 'unitCost', 1, 'Must be a number greater than or equal to 1')) {
        isValid = false;
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates complex date logic
   * @param {Object} data - Invoice data
   * @returns {boolean}
   */
  validateDateLogic(data) {
    let isValid = true;
    const today = new Date().toISOString().split('T')[0];

    // Start date cannot be in the future
    if (data.periodStart) {
      if (!this.validateDateNotFuture(data.periodStart, 'periodStart', 'Date cannot be in the future')) {
        isValid = false;
      }
    }

    // End date must be after start and before today
    if (data.periodEnd) {
      if (data.periodStart && !this.validateDateAfter(data.periodEnd, data.periodStart, 'periodEnd', 'Must be after the period start')) {
        isValid = false;
      }

      if (!this.validateDateBefore(data.periodEnd, today, 'periodEnd', 'Must be before today')) {
        isValid = false;
      }
    }

    // Due date must be after period end
    if (data.dueDate && data.periodEnd) {
      if (!this.validateDateAfter(data.dueDate, data.periodEnd, 'dueDate', 'Must be after the period end')) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Validates only the service name (for real-time use)
   * @param {string} serviceName - Service name
   * @param {string} serviceNameOption - Selected option
   * @returns {Object}
   */
  validateServiceName(serviceName, serviceNameOption) {
    this.clearErrors();
    let isValid = true;

    if (serviceNameOption === "Otro") {
      if (!this.validateRequired(serviceName, 'serviceName', 'Enter the service name')) {
        isValid = false;
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates only dates (for real-time use)
   * @param {Object} dates - Object with dates
   * @returns {Object}
   */
  validateDates(dates) {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(dates.periodStart, 'periodStart', 'Enter the period start date')) {
      isValid = false;
    }

    if (!this.validateRequired(dates.periodEnd, 'periodEnd', 'Enter the period end date')) {
      isValid = false;
    }

    if (!this.validateRequired(dates.dueDate, 'dueDate', 'Select the payment due date')) {
      isValid = false;
    }

    if (!this.validateDateLogic(dates)) {
      isValid = false;
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates only monetary values based on meter type
   * @param {Object} data - Monetary data
   * @param {string} meterType - Meter type
   * @returns {Object}
   */
  validateMonetaryValues(data, meterType) {
    this.clearErrors();
    let isValid = true;

    if (meterType === 'single') {
      if (!this.validateMinNumber(data.billValue, 'billValue', 1, 'Must be a number greater than or equal to 1')) {
        isValid = false;
      }
    } else if (meterType === 'multiple') {
      if (!this.validateRequired(data.unit, 'unit', 'Specify the billing unit')) {
        isValid = false;
      }

      if (!this.validateMinNumber(data.unitCost, 'unitCost', 1, 'Must be a number greater than or equal to 1')) {
        isValid = false;
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }
}
