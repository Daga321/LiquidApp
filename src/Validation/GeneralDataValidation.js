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
   * @returns {Object} Validation result
   */
  validate(data) {
    this.clearErrors();
    let isValid = true;

    // Validate service selection - first check if any service was selected
    if (!this.validateServiceSelection(data)) {
      isValid = false;
    }

    // Required date validations
    if (!this.validateRequired(data.periodStart, 'periodStart', 'Ingrese la fecha de inicio del período')) {
      isValid = false;
    }

    if (!this.validateRequired(data.periodEnd, 'periodEnd', 'Ingrese la fecha de fin del período')) {
      isValid = false;
    }

    if (!this.validateRequired(data.dueDate, 'dueDate', 'Seleccione la fecha límite de pago')) {
      isValid = false;
    }

    // Validate date logic
    if (!this.validateDateLogic(data)) {
      isValid = false;
    }

    // Conditional validations based on meter type
    if (data.singleMeter) {
      // Single meter - validate bill value
      if (!this.validateMinNumber(data.billValue, 'billValue', 1, 'Debe ser un número mayor o igual a 1')) {
        isValid = false;
      }
    } else {
      // Multiple meter - validate unit and unit cost
      if (!this.validateRequired(data.unit, 'unit', 'Especifique la unidad de facturación')) {
        isValid = false;
      }

      if (!this.validateMinNumber(data.unitCost, 'unitCost', 1, 'Debe ser un número mayor o igual a 1')) {
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
      if (!this.validateDateNotFuture(data.periodStart, 'periodStart', 'La fecha no puede ser en el futuro')) {
        isValid = false;
      }
    }

    // End date must be after start and before today
    if (data.periodEnd) {
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split('T')[0];
      if (data.periodStart && !this.validateDateAfter(data.periodEnd, data.periodStart, 'periodEnd', 'Debe ser posterior al inicio del período')) {
        isValid = false;
      } else if (!this.validateDateBefore(data.periodEnd, tomorrow, 'periodEnd', 'No puede ser posterior a hoy')) {
        isValid = false;
      }
    }

    // Due date must be after period end
    if (data.dueDate && data.periodEnd) {
      if (!this.validateDateAfter(data.dueDate, data.periodEnd, 'dueDate', 'Debe ser posterior al fin del período')) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Validates only the service name (for real-time use)
   * @param {string} serviceName - Service name
   * @param {string} serviceOption - Selected service option
   * @returns {Object}
   */
  validateServiceName(serviceName, serviceOption) {
    this.clearErrors();
    let isValid = true;

    // First validate that a service option is selected
    if (!serviceOption || serviceOption === "") {
      this.addError('serviceOption', 'Por favor seleccione un servicio del menú desplegable');
      isValid = false;
    } else if (serviceOption === "Otro") {
      // If "Other" is selected, validate the custom service name
      if (!this.validateRequired(serviceName, 'serviceName', 'Ingrese el nombre del servicio')) {
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

    if (!this.validateRequired(dates.periodStart, 'periodStart', 'Ingrese la fecha de inicio del período')) {
      isValid = false;
    }

    if (!this.validateRequired(dates.periodEnd, 'periodEnd', 'Ingrese la fecha de fin del período')) {
      isValid = false;
    }

    if (!this.validateRequired(dates.dueDate, 'dueDate', 'Seleccione la fecha límite de pago')) {
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
      if (!this.validateMinNumber(data.billValue, 'billValue', 1, 'Debe ser un número mayor o igual a 1')) {
        isValid = false;
      }
    } else if (meterType === 'multiple') {
      if (!this.validateRequired(data.unit, 'unit', 'Especifique la unidad de facturación')) {
        isValid = false;
      }

      if (!this.validateMinNumber(data.unitCost, 'unitCost', 1, 'Debe ser un número mayor o igual a 1')) {
        isValid = false;
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates service selection from dropdown and custom input if needed
   * @param {Object} data - Invoice data object
   * @returns {boolean}
   */
  validateServiceSelection(data) {
    // Check if a service option has been selected (not the default empty option)
    if (!data.serviceOption || data.serviceOption === "") {
      this.addError('serviceOption', 'Por favor seleccione un servicio del menú desplegable');
      return false;
    }

    // If "Otro" (Other) is selected, validate the custom service name
    if (data.serviceOption === "Otro") {
      if (!this.validateRequired(data.serviceName, 'serviceName', 'Ingrese el nombre del servicio')) {
        return false;
      }
    }

    return true;
  }
}
