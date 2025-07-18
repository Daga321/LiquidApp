import validator from 'validator';
import { ValidationBase } from './ValidationBase.js';
import { IValidationResult } from '../Types/Validation/ValidationBase.js';
import { IAdjustment } from '../Types/Models/Adjustment.js';

/**
 * Specific validation for adjustments form
 */
export class AdjustmentValidation extends ValidationBase {
  constructor() {
    super();
  }

  /**
   * Validates the form to add a new adjustment
   * @param {Object} data - Adjustment data with form field names
   * @returns {Object} Validation result
   */
  validateAddAdjustment(data: { adjustmentName: string; adjustmentAmount: string | number; adjustmentType: string }): IValidationResult {
    this.clearErrors();
    let isValid = true;

    // Validate adjustment name/concept
    if (!this.validateRequired(data.adjustmentName, 'adjustmentName', 'El concepto del ajuste es requerido')) {
      isValid = false;
    }

    // Validate adjustment value
    if (!this.validateRequired(data.adjustmentAmount, 'adjustmentAmount', 'El valor del ajuste es requerido')) {
      isValid = false;
    } else {
      // Validate that it's a valid number and greater than 0
      if (!this.validateMinNumber(data.adjustmentAmount, 'adjustmentAmount', 0.01, 'El valor debe ser mayor a 0')) {
        isValid = false;
      }
    }

    // Validate adjustment type (charge or discount)
    if (!this.validateRequired(data.adjustmentType, 'adjustmentType', 'Debe seleccionar si es un cargo adicional o un descuento')) {
      isValid = false;
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the adjustment name
   * @param {string} adjustmentName - Adjustment name
   * @returns {Object}
   */
  validateAdjustmentName(adjustmentName: string): IValidationResult {
    this.clearErrors();
    const isValid = this.validateRequired(adjustmentName, 'adjustmentName', 'El concepto del ajuste es requerido');
    
    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the adjustment value
   * @param {number} adjustmentAmount - Adjustment value
   * @returns {Object}
   */
  validateAdjustmentAmount(adjustmentAmount: string | number): IValidationResult {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(adjustmentAmount, 'adjustmentAmount', 'El valor del ajuste es requerido')) {
      isValid = false;
    } else {
      // Use validator.js to validate that it's a valid decimal number
      const stringValue = adjustmentAmount.toString();
      if (!validator.isNumeric(stringValue, { no_symbols: false })) {
        this.addError('adjustmentAmount', 'Debe ser un número válido');
        isValid = false;
      } else {
        const numValue = parseFloat(adjustmentAmount.toString());
        if (numValue <= 0) {
          this.addError('adjustmentAmount', 'El valor debe ser mayor a 0');
          isValid = false;
        }
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the adjustment type
   * @param {string} adjustmentType - Adjustment type (EXTRA_CHARGE or DISCOUNT)
   * @returns {Object}
   */
  validateAdjustmentType(adjustmentType: string): IValidationResult {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(adjustmentType, 'adjustmentType', 'Debe seleccionar si es un cargo adicional o un descuento')) {
      isValid = false;
    } else {
      // Validate that it's one of the allowed values
      const validTypes = ['EXTRA_CHARGE', 'DISCOUNT'];
      if (!validTypes.includes(adjustmentType)) {
        this.addError('adjustmentType', 'Tipo de ajuste inválido');
        isValid = false;
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates that the adjustment name is not duplicated in a property
   * @param {string} adjustmentName - Adjustment name
   * @param {Array} existingAdjustments - Existing adjustments in the property
   * @returns {Object}
   */
  validateUniqueAdjustmentName(adjustmentName: string, existingAdjustments: IAdjustment[]): IValidationResult {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(adjustmentName, 'adjustmentName', 'El concepto del ajuste es requerido')) {
      isValid = false;
    } else {
      // Check that no adjustment with the same name exists
      const isDuplicate = existingAdjustments.some(
        (adjustment: IAdjustment) => adjustment.note.toLowerCase().trim() === adjustmentName.toLowerCase().trim()
      );

      if (isDuplicate) {
        this.addError('adjustmentName', 'Ya existe un ajuste con este concepto en esta propiedad');
        isValid = false;
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates a complete list of adjustments
   * @param {Array} adjustments - List of adjustments
   * @returns {Object}
   */
  validateAdjustmentsList(adjustments: IAdjustment[]): IValidationResult {
    this.clearErrors();
    let isValid = true;

    if (!Array.isArray(adjustments)) {
      this.addError('adjustments', 'La lista de ajustes no es válida');
      this.setValidState(false);
      return this.getValidationResult();
    }

    // Validate each individual adjustment
    adjustments.forEach((adjustment: IAdjustment, index: number) => {
      const fieldPrefix = `adjustment_${index}`;
      
      if (!this.validateRequired(adjustment.note, `${fieldPrefix}_note`, 'El concepto es requerido')) {
        isValid = false;
      }

      if (!this.validateMinNumber(adjustment.value, `${fieldPrefix}_value`, 0.01, 'El valor debe ser mayor a 0')) {
        isValid = false;
      }

      // Validate that type is valid (since IAdjustment uses IAdjustmentType)
      if (!adjustment.type || !adjustment.type.Key) {
        this.addError(`${fieldPrefix}_type`, 'Tipo de ajuste inválido');
        isValid = false;
      }
    });

    // Check for duplicate names
    const names = adjustments.map((adj: IAdjustment) => adj.note.toLowerCase().trim());
    const duplicates = names.filter((name: string, index: number) => names.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      this.addError('adjustments', 'Hay ajustes con nombres duplicados');
      isValid = false;
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates currency format using validator.js
   * @param {string} amount - Amount as string
   * @returns {boolean}
   */
  validateCurrencyFormat(amount: string): boolean {
    // Use validator.js to validate currency format
    return validator.isCurrency(amount, {
      symbol: '$',
      require_symbol: false,
      allow_space_after_symbol: false,
      symbol_after_digits: false,
      allow_negatives: false,
      parens_for_negatives: false,
      negative_sign_before_digits: false,
      negative_sign_after_digits: false,
      allow_negative_sign_placeholder: false,
      thousands_separator: ',',
      decimal_separator: '.',
      allow_decimal: true,
      require_decimal: false,
      digits_after_decimal: [0, 1, 2]
    });
  }
}
