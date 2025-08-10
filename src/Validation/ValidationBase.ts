import { IValidationResult } from '../../Types/Validation/ValidationBase';

/**
 * Base class for all validations
 * Provides common functionality like error handling and validation state
 */
export class ValidationBase {
  protected errors: Map<string, string>;
  protected isValidState: boolean;

  constructor() {
    this.errors = new Map<string, string>();
    this.isValidState = false;
  }

  /**
   * Adds an error to the error map
   * @param {string} field - Field that has the error
   * @param {string} message - Error message
   */
  addError(field: string, message: string): void {
    if (message) {
      this.errors.set(field, message);
    } else {
      this.errors.delete(field);
    }
  }

  /**
   * Clears all errors
   */
  clearErrors(): void {
    this.errors.clear();
  }

  /**
   * Checks if there are errors
   * @returns {boolean}
   */
  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  /**
   * Gets all current errors
   * @returns {Object}
   */
  getErrors(): Record<string, string> {
    return Object.fromEntries(this.errors);
  }

  /**
   * Returns the current validation state
   * @returns {boolean}
   */
  isValid(): boolean {
    return this.isValidState && !this.hasErrors();
  }

  /**
   * Sets the validation state
   * @param {boolean} state 
   */
  setValidState(state: boolean): void {
    this.isValidState = state;
  }

  /**
   * Returns the complete validation result
   * @returns {Object}
   */
  getValidationResult(): IValidationResult {
    return {
      isValid: this.isValid(),
      errors: this.getErrors(),
      hasErrors: this.hasErrors()
    };
  }

  /**
   * Abstract method that must be implemented by child classes
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result
   */
  validate(data: any): IValidationResult {
    throw new Error('The validate() method must be implemented by the child class');
  }

  /**
   * Validates that a field is not empty
   * @param {any} value - Value to validate
   * @param {string} field - Field name
   * @param {string} message - Error message
   * @returns {boolean}
   */
  validateRequired(value: any, field: string, message: string): boolean {
    const isEmpty = value === null || value === undefined || 
                   (typeof value === 'string' && value.trim() === '') ||
                   (typeof value === 'number' && isNaN(value));
    
    if (isEmpty) {
      this.addError(field, message);
      return false;
    }
    
    this.addError(field, '');
    return true;
  }

  /**
   * Validates that a numeric value is greater than a minimum
   * @param {number} value - Value to validate
   * @param {string} field - Field name
   * @param {number} min - Minimum value
   * @param {string} message - Error message
   * @returns {boolean}
   */
  validateMinNumber(value: string | number, field: string, min: number, message: string): boolean {
    const numValue = parseFloat(value.toString());
    
    if (isNaN(numValue) || numValue < min) {
      this.addError(field, message);
      return false;
    }
    
    this.addError(field, '');
    return true;
  }

  /**
   * Validates that a numeric value is less than a maximum
   * @param {number} value - Value to validate
   * @param {string} field - Field name
   * @param {number} max - Maximum value
   * @param {string} message - Error message
   * @returns {boolean}
   */
  validateMaxNumber(value: string | number, field: string, max: number, message: string): boolean {
    const numValue = parseFloat(value.toString());
    
    if (isNaN(numValue) || numValue > max) {
      this.addError(field, message);
      return false;
    }
    
    this.addError(field, '');
    return true;
  }

  /**
   * Validates that a date is not in the future
   * @param {string} dateValue - Date in YYYY-MM-DD format
   * @param {string} field - Field name
   * @param {string} message - Error message
   * @returns {boolean}
   */
  validateDateNotFuture(dateValue: string, field: string, message: string): boolean {
    if (!dateValue) return true;
    
    const today = new Date().toISOString().split('T')[0];
    
    if (dateValue > today) {
      this.addError(field, message);
      return false;
    }
    
    this.addError(field, '');
    return true;
  }

  /**
   * Validates that a date is after another date
   * @param {string} dateValue - Date to validate
   * @param {string} compareDate - Comparison date
   * @param {string} field - Field name
   * @param {string} message - Error message
   * @returns {boolean}
   */
  validateDateAfter(dateValue: string, compareDate: string, field: string, message: string): boolean {
    if (!dateValue || !compareDate) return true;
    
    if (dateValue <= compareDate) {
      this.addError(field, message);
      return false;
    }
    
    this.addError(field, '');
    return true;
  }

  /**
   * Validates that a date is before another date
   * @param {string} dateValue - Date to validate
   * @param {string} compareDate - Comparison date
   * @param {string} field - Field name
   * @param {string} message - Error message
   * @returns {boolean}
   */
  validateDateBefore(dateValue: string, compareDate: string, field: string, message: string): boolean {
    if (!dateValue || !compareDate) return true;
    
    if (dateValue >= compareDate) {
      this.addError(field, message);
      return false;
    }
    
    this.addError(field, '');
    return true;
  }
}
