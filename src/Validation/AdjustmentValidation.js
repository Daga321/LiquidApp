import validator from 'validator';
import { ValidationBase } from './ValidationBase.js';

/**
 * Specific validation for adjustments form
 */
export class AdjustmentValidation extends ValidationBase {
  constructor() {
    super();
  }

  /**
   * Validates the form to add a new adjustment
   * @param {Object} data - Adjustment data
   * @returns {Object} Validation result
   */
  validateAddAdjustment(data) {
    this.clearErrors();
    let isValid = true;

    // Validate adjustment name/concept
    if (!this.validateRequired(data.adjustmentName, 'adjustmentName', 'Adjustment concept is required')) {
      isValid = false;
    }

    // Validate adjustment value
    if (!this.validateRequired(data.adjustmentAmount, 'adjustmentAmount', 'Adjustment value is required')) {
      isValid = false;
    } else {
      // Validate that it's a valid number and greater than 0
      if (!this.validateMinNumber(data.adjustmentAmount, 'adjustmentAmount', 0.01, 'Value must be greater than 0')) {
        isValid = false;
      }
    }

    // Validate adjustment type (charge or discount)
    if (!this.validateRequired(data.adjustmentType, 'adjustmentType', 'Must select if it is an additional charge or a discount')) {
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
  validateAdjustmentName(adjustmentName) {
    this.clearErrors();
    const isValid = this.validateRequired(adjustmentName, 'adjustmentName', 'Adjustment concept is required');
    
    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the adjustment value
   * @param {number} adjustmentAmount - Adjustment value
   * @returns {Object}
   */
  validateAdjustmentAmount(adjustmentAmount) {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(adjustmentAmount, 'adjustmentAmount', 'Adjustment value is required')) {
      isValid = false;
    } else {
      // Use validator.js to validate that it's a valid decimal number
      const stringValue = adjustmentAmount.toString();
      if (!validator.isNumeric(stringValue, { no_symbols: false })) {
        this.addError('adjustmentAmount', 'Must be a valid number');
        isValid = false;
      } else {
        const numValue = parseFloat(adjustmentAmount);
        if (numValue <= 0) {
          this.addError('adjustmentAmount', 'Value must be greater than 0');
          isValid = false;
        }
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the adjustment type
   * @param {string} adjustmentType - Adjustment type (CHARGE or DISCOUNT)
   * @returns {Object}
   */
  validateAdjustmentType(adjustmentType) {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(adjustmentType, 'adjustmentType', 'Must select if it is an additional charge or a discount')) {
      isValid = false;
    } else {
      // Validate that it's one of the allowed values
      const validTypes = ['CHARGE', 'DISCOUNT'];
      if (!validTypes.includes(adjustmentType)) {
        this.addError('adjustmentType', 'Invalid adjustment type');
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
  validateUniqueAdjustmentName(adjustmentName, existingAdjustments) {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(adjustmentName, 'adjustmentName', 'Adjustment concept is required')) {
      isValid = false;
    } else {
      // Check that no adjustment with the same name exists
      const isDuplicate = existingAdjustments.some(
        adjustment => adjustment.name.toLowerCase().trim() === adjustmentName.toLowerCase().trim()
      );

      if (isDuplicate) {
        this.addError('adjustmentName', 'An adjustment with this concept already exists in this property');
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
  validateAdjustmentsList(adjustments) {
    this.clearErrors();
    let isValid = true;

    if (!Array.isArray(adjustments)) {
      this.addError('adjustments', 'Adjustments list is not valid');
      this.setValidState(false);
      return this.getValidationResult();
    }

    // Validate each individual adjustment
    adjustments.forEach((adjustment, index) => {
      const fieldPrefix = `adjustment_${index}`;
      
      if (!this.validateRequired(adjustment.name, `${fieldPrefix}_name`, 'Concept is required')) {
        isValid = false;
      }

      if (!this.validateMinNumber(adjustment.amount, `${fieldPrefix}_amount`, 0.01, 'Value must be greater than 0')) {
        isValid = false;
      }

      if (!['CHARGE', 'DISCOUNT'].includes(adjustment.type)) {
        this.addError(`${fieldPrefix}_type`, 'Invalid adjustment type');
        isValid = false;
      }
    });

    // Check for duplicate names
    const names = adjustments.map(adj => adj.name.toLowerCase().trim());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      this.addError('adjustments', 'There are adjustments with duplicate names');
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
  validateCurrencyFormat(amount) {
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
