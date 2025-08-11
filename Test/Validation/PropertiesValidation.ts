import { describe, it, expect, beforeEach } from 'vitest';
import { PropertiesValidation } from '../../src/Validation/PropertiesValidation';
import { IPropertyFormData, IPropertyValidation } from '../../Types/Validation/PropertiesValidation';
import { ILiquidationMethod } from '../../Types/Models/Enums/LiquidationMethodEnum';
import { LiquidationMethodEnum } from '../../src/Models/Enums/LiquidationMethodEnum';

describe('Function validateAddProperty', () => {
  let validation: PropertiesValidation;
  let validFormData: IPropertyFormData;
  let validLiquidationMethod: ILiquidationMethod;
  let existingProperties: IPropertyValidation[];

  beforeEach(() => {
    validation = new PropertiesValidation();

    validLiquidationMethod = {
      Key: LiquidationMethodEnum.CONSUMPTION.Key,
      Method: LiquidationMethodEnum.CONSUMPTION.Method,
      InputPlaceHolder: LiquidationMethodEnum.CONSUMPTION.InputPlaceHolder
    };

    validFormData = {
      propertyName: 'Test Property',
      liquidationMethod: validLiquidationMethod
    };

    existingProperties = [
      {
        name: 'Existing Property',
        method: LiquidationMethodEnum.CONSUMPTION.Key,
        baseValue: 100
      }
    ];
  });

  it('should return valid result for complete valid form data', () => {
    const result = validation.validateAddProperty(validFormData, existingProperties);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return valid result with empty existing properties array', () => {
    const result = validation.validateAddProperty(validFormData, []);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return valid result with default existing properties parameter', () => {
    const result = validation.validateAddProperty(validFormData);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should add error when propertyName is empty', () => {
    const formData = {
      ...validFormData,
      propertyName: ''
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.propertyName).toBe('string');
  });

  it('should add error when propertyName is null', () => {
    const formData = {
      ...validFormData,
      propertyName: null as any
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.propertyName).toBe('string');
  });

  it('should add error when propertyName is whitespace only', () => {
    const formData = {
      ...validFormData,
      propertyName: '   '
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.propertyName).toBe('string');
  });

  it('should add error when propertyName already exists (case insensitive)', () => {
    const formData = {
      ...validFormData,
      propertyName: 'EXISTING PROPERTY' // uppercase version
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.propertyName).toBe('string');
  });

  it('should add error when propertyName already exists (exact match)', () => {
    const formData = {
      ...validFormData,
      propertyName: 'Existing Property'
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.propertyName).toBe('string');
  });

  it('should add error when propertyName already exists (with extra spaces)', () => {
    const formData = {
      ...validFormData,
      propertyName: '  Existing Property  ' // with spaces
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.propertyName).toBe('string');
  });

  it('should not add error when propertyName is unique', () => {
    const formData = {
      ...validFormData,
      propertyName: 'Unique Property Name'
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(true);
    expect(result.errors.propertyName).toBeUndefined();
  });

  it('should add error when liquidationMethod is undefined', () => {
    const formData = {
      ...validFormData,
      liquidationMethod: undefined
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.liquidationMethod).toBe('string');
  });

  it('should add error when liquidationMethod is null', () => {
    const formData = {
      ...validFormData,
      liquidationMethod: null as any
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.liquidationMethod).toBe('string');
  });

  it('should add error when liquidationMethod Key is empty', () => {
    const formData = {
      ...validFormData,
      liquidationMethod: {
        Key: '',
        Method: LiquidationMethodEnum.CONSUMPTION.Method,
        InputPlaceHolder: LiquidationMethodEnum.CONSUMPTION.InputPlaceHolder
      }
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.liquidationMethod).toBe('string');
  });

  it('should add error when liquidationMethod Key is null', () => {
    const formData = {
      ...validFormData,
      liquidationMethod: {
        Key: null as any,
        Method: LiquidationMethodEnum.CONSUMPTION.Method,
        InputPlaceHolder: LiquidationMethodEnum.CONSUMPTION.InputPlaceHolder
      }
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.liquidationMethod).toBe('string');
  });

  it('should accept all valid liquidation method types', () => {
    const methods = [
      LiquidationMethodEnum.CONSUMPTION,
      LiquidationMethodEnum.PERCENTAGE,
      LiquidationMethodEnum.PEOPLE
    ];

    methods.forEach(method => {
      validation.clearErrors();
      const formData = {
        ...validFormData,
        propertyName: `Property ${method.Key}`,
        liquidationMethod: method
      };

      const result = validation.validateAddProperty(formData, existingProperties);

      expect(result.isValid).toBe(true);
      expect(result.hasErrors).toBe(false);
    });
  });

  it('should handle multiple validation errors simultaneously', () => {
    const formData = {
      propertyName: '',
      liquidationMethod: undefined
    };

    const result = validation.validateAddProperty(formData, existingProperties);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.propertyName).toBe('string');
    expect(typeof result.errors.liquidationMethod).toBe('string');
  });

  it('should clear previous errors before validation', () => {
    // First validation with errors
    const invalidFormData = {
      ...validFormData,
      propertyName: ''
    };
    validation.validateAddProperty(invalidFormData, existingProperties);

    // Second validation with valid data
    const result = validation.validateAddProperty(validFormData, existingProperties);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});

describe('Function validatePropertiesTable', () => {
  let validation: PropertiesValidation;

  beforeEach(() => {
    validation = new PropertiesValidation();
  });

  it('should return valid result for valid single meter with mixed methods', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 100 },
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 30 },
      { name: 'Property 3', method: LiquidationMethodEnum.PEOPLE.Key, baseValue: 4 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return valid result for valid multiple meter', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 100 },
      { name: 'Property 2', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 200 }
    ];

    const result = validation.validatePropertiesTable(properties, false);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return valid result for single meter with only percentages totaling 100', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 60 },
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 40 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return invalid result for empty properties array', () => {
    const result = validation.validatePropertiesTable([], true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(false); // No specific errors, just invalid state
  });

  it('should add error for multiple meter when value is less than 1', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 0.5 }
    ];

    const result = validation.validatePropertiesTable(properties, false);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error for multiple meter when value is not integer', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 10.5 }
    ];

    const result = validation.validatePropertiesTable(properties, false);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error for multiple meter when value is NaN', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 'invalid' }
    ];

    const result = validation.validatePropertiesTable(properties, false);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error for single meter consumption when value is less than 1', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 0.5 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error for single meter people when value is less than 1', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.PEOPLE.Key, baseValue: 0 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error for single meter percentage when value is less than 1', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 0 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error for single meter percentage when value is greater than 100', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 101 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error for single meter percentage when value is not integer', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 50.5 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
  });

  it('should add error when only percentages and total is not 100', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 60 },
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 30 } // total = 90
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
    expect(typeof result.errors.property_1_value).toBe('string');
  });

  it('should add error when mixed methods and percentage total is 0', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 100 },
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 0 } // This will fail individual validation first
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_1_value).toBe('string');
  });

  it('should add error when mixed methods and percentage total is 100', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 100 },
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 100 } // total = 100, but there are other methods
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_1_value).toBe('string');
  });

  it('should accept mixed methods with valid percentage total', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 100 },
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 50 }, // valid percentage
      { name: 'Property 3', method: LiquidationMethodEnum.PEOPLE.Key, baseValue: 4 }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
  });

  it('should accept string numbers for baseValue', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: '100' },
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: '50' }
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
  });

  it('should handle multiple errors across different properties', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 0 }, // invalid
      { name: 'Property 2', method: LiquidationMethodEnum.PERCENTAGE.Key, baseValue: 101 }, // invalid
      { name: 'Property 3', method: LiquidationMethodEnum.PEOPLE.Key, baseValue: 0.5 } // invalid
    ];

    const result = validation.validatePropertiesTable(properties, true);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.property_0_value).toBe('string');
    expect(typeof result.errors.property_1_value).toBe('string');
    expect(typeof result.errors.property_2_value).toBe('string');
  });

  it('should use default isSingleMeter parameter when not provided', () => {
    const properties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 100 }
    ];

    const result = validation.validatePropertiesTable(properties);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
  });

  it('should clear previous errors before validation', () => {
    // First validation with errors
    const invalidProperties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 0 }
    ];
    validation.validatePropertiesTable(invalidProperties, true);

    // Second validation with valid data
    const validProperties = [
      { name: 'Property 1', method: LiquidationMethodEnum.CONSUMPTION.Key, baseValue: 100 }
    ];
    const result = validation.validatePropertiesTable(validProperties, true);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
