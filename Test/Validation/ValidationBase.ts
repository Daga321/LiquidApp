import { describe, it, expect, beforeEach } from 'vitest';
import { ValidationBase } from '../../src/Validation/ValidationBase';
import { IValidationResult } from '../../Types/Validation/ValidationBase';

// Test implementation class to test the abstract ValidationBase
class TestValidation extends ValidationBase {
  validate(data: any): IValidationResult {
    // Simple implementation for testing
    this.setValidState(true);
    return this.getValidationResult();
  }
}

describe('Function addError', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should add error when message is provided', () => {
    validation.addError('testField', 'Test error message');
    
    const errors = validation.getErrors();
    expect(errors.testField).toBe('Test error message');
    expect(validation.hasErrors()).toBe(true);
  });

  it('should remove error when empty message is provided', () => {
    validation.addError('testField', 'Initial error');
    validation.addError('testField', '');
    
    const errors = validation.getErrors();
    expect(errors.testField).toBeUndefined();
    expect(validation.hasErrors()).toBe(false);
  });

  it('should remove error when null message is provided', () => {
    validation.addError('testField', 'Initial error');
    validation.addError('testField', null as any);
    
    const errors = validation.getErrors();
    expect(errors.testField).toBeUndefined();
    expect(validation.hasErrors()).toBe(false);
  });

  it('should handle multiple fields with errors', () => {
    validation.addError('field1', 'Error 1');
    validation.addError('field2', 'Error 2');
    
    const errors = validation.getErrors();
    expect(errors.field1).toBe('Error 1');
    expect(errors.field2).toBe('Error 2');
    expect(validation.hasErrors()).toBe(true);
  });
});

describe('Function clearErrors', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should clear all errors when errors exist', () => {
    validation.addError('field1', 'Error 1');
    validation.addError('field2', 'Error 2');
    
    validation.clearErrors();
    
    expect(validation.hasErrors()).toBe(false);
    expect(Object.keys(validation.getErrors())).toHaveLength(0);
  });

  it('should work correctly when no errors exist', () => {
    validation.clearErrors();
    
    expect(validation.hasErrors()).toBe(false);
    expect(Object.keys(validation.getErrors())).toHaveLength(0);
  });
});

describe('Function hasErrors', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return true when errors exist', () => {
    validation.addError('testField', 'Test error');
    
    expect(validation.hasErrors()).toBe(true);
  });

  it('should return false when no errors exist', () => {
    expect(validation.hasErrors()).toBe(false);
  });

  it('should return false after clearing errors', () => {
    validation.addError('testField', 'Test error');
    validation.clearErrors();
    
    expect(validation.hasErrors()).toBe(false);
  });
});

describe('Function getErrors', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return empty object when no errors exist', () => {
    const errors = validation.getErrors();
    
    expect(errors).toEqual({});
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should return all errors as object', () => {
    validation.addError('field1', 'Error 1');
    validation.addError('field2', 'Error 2');
    
    const errors = validation.getErrors();
    
    expect(errors).toEqual({
      field1: 'Error 1',
      field2: 'Error 2'
    });
  });

  it('should return updated errors after modification', () => {
    validation.addError('field1', 'Initial error');
    validation.addError('field1', 'Updated error');
    
    const errors = validation.getErrors();
    
    expect(errors.field1).toBe('Updated error');
  });
});

describe('Function isValid', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return false when validation state is false and no errors', () => {
    validation.setValidState(false);
    
    expect(validation.isValid()).toBe(false);
  });

  it('should return false when validation state is true but has errors', () => {
    validation.setValidState(true);
    validation.addError('testField', 'Test error');
    
    expect(validation.isValid()).toBe(false);
  });

  it('should return true when validation state is true and no errors', () => {
    validation.setValidState(true);
    
    expect(validation.isValid()).toBe(true);
  });

  it('should return false when validation state is false and has errors', () => {
    validation.setValidState(false);
    validation.addError('testField', 'Test error');
    
    expect(validation.isValid()).toBe(false);
  });
});

describe('Function setValidState', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should set validation state to true', () => {
    validation.setValidState(true);
    
    // Test through isValid since isValidState is protected
    expect(validation.isValid()).toBe(true);
  });

  it('should set validation state to false', () => {
    validation.setValidState(true);
    validation.setValidState(false);
    
    expect(validation.isValid()).toBe(false);
  });

  it('should allow multiple state changes', () => {
    validation.setValidState(true);
    expect(validation.isValid()).toBe(true);
    
    validation.setValidState(false);
    expect(validation.isValid()).toBe(false);
    
    validation.setValidState(true);
    expect(validation.isValid()).toBe(true);
  });
});

describe('Function getValidationResult', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return complete validation result with valid state and no errors', () => {
    validation.setValidState(true);
    
    const result = validation.getValidationResult();
    
    expect(result).toEqual({
      isValid: true,
      errors: {},
      hasErrors: false
    });
  });

  it('should return complete validation result with invalid state and errors', () => {
    validation.setValidState(false);
    validation.addError('field1', 'Error 1');
    validation.addError('field2', 'Error 2');
    
    const result = validation.getValidationResult();
    
    expect(result).toEqual({
      isValid: false,
      errors: {
        field1: 'Error 1',
        field2: 'Error 2'
      },
      hasErrors: true
    });
  });

  it('should return invalid result when state is true but has errors', () => {
    validation.setValidState(true);
    validation.addError('testField', 'Test error');
    
    const result = validation.getValidationResult();
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.testField).toBe('Test error');
  });
});

describe('Function validate', () => {
  let validation: ValidationBase;

  beforeEach(() => {
    validation = new ValidationBase();
  });

  it('should throw error when called on base class', () => {
    expect(() => {
      validation.validate({});
    }).toThrow('The validate() method must be implemented by the child class');
  });

  it('should throw error with any data input', () => {
    expect(() => {
      validation.validate(null);
    }).toThrow('The validate() method must be implemented by the child class');
    
    expect(() => {
      validation.validate({ field: 'value' });
    }).toThrow('The validate() method must be implemented by the child class');
  });
});

describe('Function validateRequired', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return true and clear error for valid string value', () => {
    const result = validation.validateRequired('valid value', 'testField', 'Field is required');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true and clear error for valid number value', () => {
    const result = validation.validateRequired(123, 'testField', 'Field is required');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error for null value', () => {
    const result = validation.validateRequired(null, 'testField', 'Field is required');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Field is required');
  });

  it('should return false and add error for undefined value', () => {
    const result = validation.validateRequired(undefined, 'testField', 'Field is required');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Field is required');
  });

  it('should return false and add error for empty string', () => {
    const result = validation.validateRequired('', 'testField', 'Field is required');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Field is required');
  });

  it('should return false and add error for whitespace-only string', () => {
    const result = validation.validateRequired('   ', 'testField', 'Field is required');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Field is required');
  });

  it('should return false and add error for NaN number', () => {
    const result = validation.validateRequired(NaN, 'testField', 'Field is required');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Field is required');
  });

  it('should return true for zero value', () => {
    const result = validation.validateRequired(0, 'testField', 'Field is required');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true for false boolean value', () => {
    const result = validation.validateRequired(false, 'testField', 'Field is required');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });
});

describe('Function validateMinNumber', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return true and clear error when number is greater than minimum', () => {
    const result = validation.validateMinNumber(10, 'testField', 5, 'Value must be at least 5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true and clear error when number equals minimum', () => {
    const result = validation.validateMinNumber(5, 'testField', 5, 'Value must be at least 5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error when number is less than minimum', () => {
    const result = validation.validateMinNumber(3, 'testField', 5, 'Value must be at least 5');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Value must be at least 5');
  });

  it('should return true for valid string number greater than minimum', () => {
    const result = validation.validateMinNumber('10', 'testField', 5, 'Value must be at least 5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error for invalid string', () => {
    const result = validation.validateMinNumber('invalid', 'testField', 5, 'Value must be at least 5');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Value must be at least 5');
  });

  it('should return false and add error for empty string', () => {
    const result = validation.validateMinNumber('', 'testField', 5, 'Value must be at least 5');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Value must be at least 5');
  });

  it('should handle negative minimum values correctly', () => {
    const result = validation.validateMinNumber(-3, 'testField', -5, 'Value must be at least -5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should handle decimal values correctly', () => {
    const result = validation.validateMinNumber(5.5, 'testField', 5.2, 'Value must be at least 5.2');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });
});

describe('Function validateMaxNumber', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return true and clear error when number is less than maximum', () => {
    const result = validation.validateMaxNumber(3, 'testField', 5, 'Value must be at most 5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true and clear error when number equals maximum', () => {
    const result = validation.validateMaxNumber(5, 'testField', 5, 'Value must be at most 5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error when number is greater than maximum', () => {
    const result = validation.validateMaxNumber(10, 'testField', 5, 'Value must be at most 5');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Value must be at most 5');
  });

  it('should return true for valid string number less than maximum', () => {
    const result = validation.validateMaxNumber('3', 'testField', 5, 'Value must be at most 5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error for invalid string', () => {
    const result = validation.validateMaxNumber('invalid', 'testField', 5, 'Value must be at most 5');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Value must be at most 5');
  });

  it('should return false and add error for empty string', () => {
    const result = validation.validateMaxNumber('', 'testField', 5, 'Value must be at most 5');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Value must be at most 5');
  });

  it('should handle negative maximum values correctly', () => {
    const result = validation.validateMaxNumber(-3, 'testField', -1, 'Value must be at most -1');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should handle decimal values correctly', () => {
    const result = validation.validateMaxNumber(5.2, 'testField', 5.5, 'Value must be at most 5.5');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });
});

describe('Function validateDateNotFuture', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return true and clear error for today date', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = validation.validateDateNotFuture(today, 'testField', 'Date cannot be in the future');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true and clear error for past date', () => {
    const pastDate = '2023-01-01';
    const result = validation.validateDateNotFuture(pastDate, 'testField', 'Date cannot be in the future');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error for future date', () => {
    const futureDate = '2030-12-31';
    const result = validation.validateDateNotFuture(futureDate, 'testField', 'Date cannot be in the future');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Date cannot be in the future');
  });

  it('should return true for empty string', () => {
    const result = validation.validateDateNotFuture('', 'testField', 'Date cannot be in the future');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true for null value', () => {
    const result = validation.validateDateNotFuture(null as any, 'testField', 'Date cannot be in the future');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true for undefined value', () => {
    const result = validation.validateDateNotFuture(undefined as any, 'testField', 'Date cannot be in the future');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });
});

describe('Function validateDateAfter', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return true and clear error when date is after compare date', () => {
    const result = validation.validateDateAfter('2023-06-01', '2023-05-01', 'testField', 'Date must be after compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error when date equals compare date', () => {
    const result = validation.validateDateAfter('2023-05-01', '2023-05-01', 'testField', 'Date must be after compare date');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Date must be after compare date');
  });

  it('should return false and add error when date is before compare date', () => {
    const result = validation.validateDateAfter('2023-04-01', '2023-05-01', 'testField', 'Date must be after compare date');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Date must be after compare date');
  });

  it('should return true when dateValue is empty', () => {
    const result = validation.validateDateAfter('', '2023-05-01', 'testField', 'Date must be after compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when compareDate is empty', () => {
    const result = validation.validateDateAfter('2023-06-01', '', 'testField', 'Date must be after compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when both dates are empty', () => {
    const result = validation.validateDateAfter('', '', 'testField', 'Date must be after compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when dateValue is null', () => {
    const result = validation.validateDateAfter(null as any, '2023-05-01', 'testField', 'Date must be after compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when compareDate is null', () => {
    const result = validation.validateDateAfter('2023-06-01', null as any, 'testField', 'Date must be after compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });
});

describe('Function validateDateBefore', () => {
  let validation: TestValidation;

  beforeEach(() => {
    validation = new TestValidation();
  });

  it('should return true and clear error when date is before compare date', () => {
    const result = validation.validateDateBefore('2023-04-01', '2023-05-01', 'testField', 'Date must be before compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return false and add error when date equals compare date', () => {
    const result = validation.validateDateBefore('2023-05-01', '2023-05-01', 'testField', 'Date must be before compare date');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Date must be before compare date');
  });

  it('should return false and add error when date is after compare date', () => {
    const result = validation.validateDateBefore('2023-06-01', '2023-05-01', 'testField', 'Date must be before compare date');
    
    expect(result).toBe(false);
    expect(validation.getErrors().testField).toBe('Date must be before compare date');
  });

  it('should return true when dateValue is empty', () => {
    const result = validation.validateDateBefore('', '2023-05-01', 'testField', 'Date must be before compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when compareDate is empty', () => {
    const result = validation.validateDateBefore('2023-04-01', '', 'testField', 'Date must be before compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when both dates are empty', () => {
    const result = validation.validateDateBefore('', '', 'testField', 'Date must be before compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when dateValue is null', () => {
    const result = validation.validateDateBefore(null as any, '2023-05-01', 'testField', 'Date must be before compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });

  it('should return true when compareDate is null', () => {
    const result = validation.validateDateBefore('2023-04-01', null as any, 'testField', 'Date must be before compare date');
    
    expect(result).toBe(true);
    expect(validation.getErrors().testField).toBeUndefined();
  });
});
