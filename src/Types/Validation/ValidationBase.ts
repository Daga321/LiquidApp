/**
 * Interface for validation result returned by getValidationResult method
 */
export interface IValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  hasErrors: boolean;
}
