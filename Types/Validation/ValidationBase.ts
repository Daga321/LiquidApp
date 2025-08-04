/**
 * Interface for validation result returned by getValidationResult method
 */
export interface IValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  hasErrors: boolean;
}

/**
 * Interface for validation base class methods
 */
export interface IValidationBase {
  /**
   * Adds an error for a specific field
   */
  addError(field: string, message: string): void;

  /**
   * Removes an error for a specific field
   */
  removeError(field: string): void;

  /**
   * Clears all errors
   */
  clearErrors(): void;

  /**
   * Checks if the current state is valid
   */
  isValid(): boolean;

  /**
   * Checks if there are errors
   */
  hasErrors(): boolean;

  /**
   * Gets all current errors
   */
  getErrors(): Record<string, string>;

  /**
   * Sets the validation state
   */
  setValidationState(state: boolean): void;

  /**
   * Returns the complete validation result
   */
  getValidationResult(): IValidationResult;

  /**
   * Abstract method that must be implemented by child classes
   */
  validate(data: any): IValidationResult;

  /**
   * Validates that a field is not empty
   */
  validateRequired(value: any, field: string, message: string): boolean;
}
