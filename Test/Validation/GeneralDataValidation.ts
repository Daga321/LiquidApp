import { describe, it, expect, beforeEach } from 'vitest';
import { GeneralDataValidation } from '../../src/Validation/GeneralDataValidation';
import {
  IGeneralDataValidation,
  IDateValidationData,
  IServiceValidationData,
  IMonetaryValidationData
} from '../../Types/Validation/GeneralDataValidation';

describe('Function validate', () => {
  let validation: GeneralDataValidation;
  let validData: IGeneralDataValidation;

  beforeEach(() => {
    validation = new GeneralDataValidation();

    validData = {
      serviceName: 'Test Service',
      serviceOption: 'Agua',
      billValue: 100,
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
      dueDate: '2024-02-15',
      singleMeter: true
    };
  });

  it('should return valid result for complete valid single meter data', () => {
    const result = validation.validate(validData);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return valid result for complete valid multiple meter data', () => {
    const multipleData = {
      ...validData,
      singleMeter: false,
      billValue: undefined,
      unit: 'kWh',
      unitCost: 50
    };

    const result = validation.validate(multipleData);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return valid result when serviceOption is "Otro" with valid serviceName', () => {
    const customServiceData = {
      ...validData,
      serviceOption: 'Otro',
      serviceName: 'Custom Service Name'
    };

    const result = validation.validate(customServiceData);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
  });

  it('should add error when serviceOption is empty', () => {
    const data = {
      ...validData,
      serviceOption: ''
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.serviceOption).toBe('string');
  });

  it('should add error when serviceOption is "Otro" but serviceName is empty', () => {
    const data = {
      ...validData,
      serviceOption: 'Otro',
      serviceName: ''
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.serviceName).toBe('string');
  });

  it('should add error when periodStart is empty', () => {
    const data = {
      ...validData,
      periodStart: ''
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.periodStart).toBe('string');
  });

  it('should add error when periodEnd is empty', () => {
    const data = {
      ...validData,
      periodEnd: ''
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.periodEnd).toBe('string');
  });

  it('should add error when dueDate is empty', () => {
    const data = {
      ...validData,
      dueDate: ''
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.dueDate).toBe('string');
  });

  it('should handle multiple validation errors simultaneously', () => {
    const data = {
      serviceName: '',
      serviceOption: '',
      periodStart: '',
      periodEnd: '',
      dueDate: '',
      singleMeter: true,
      billValue: 1 // Valid to avoid monetary validation errors
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(typeof result.errors.serviceOption).toBe('string');
    expect(typeof result.errors.periodStart).toBe('string');
    expect(typeof result.errors.periodEnd).toBe('string');
    expect(typeof result.errors.dueDate).toBe('string');
  });

  it('should clear previous errors before validation', () => {
    // First validation with errors
    const invalidData = {
      ...validData,
      serviceOption: ''
    };
    validation.validate(invalidData);

    // Second validation with valid data
    const result = validation.validate(validData);

    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should call validateServiceSelection and handle its result', () => {
    const data = {
      ...validData,
      serviceOption: ''
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(typeof result.errors.serviceOption).toBe('string');
  });

  it('should call validateDateLogic and handle its result', () => {
    const data = {
      ...validData,
      periodStart: '2030-12-31' // future date
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(typeof result.errors.periodStart).toBe('string');
  });

  it('should call validateMonetaryValues for single meter and handle its result', () => {
    const data = {
      ...validData,
      singleMeter: true,
      billValue: 0.5
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(typeof result.errors.billValue).toBe('string');
  });

  it('should call validateMonetaryValues for multiple meter and handle its result', () => {
    const data = {
      ...validData,
      singleMeter: false,
      billValue: undefined,
      unit: '',
      unitCost: 50
    };

    const result = validation.validate(data);

    expect(result.isValid).toBe(false);
    expect(typeof result.errors.unit).toBe('string');
  });
});

describe('Function validateDateLogic', () => {
  let validation: GeneralDataValidation;
  let validDateData: IDateValidationData;

  beforeEach(() => {
    validation = new GeneralDataValidation();

    validDateData = {
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
      dueDate: '2024-02-15'
    };
  });

  it('should return true for valid date sequence', () => {
    const result = validation.validateDateLogic(validDateData);

    expect(result).toBe(true);
    expect(validation.hasErrors()).toBe(false);
  });

  it('should return false when periodStart is in the future', () => {
    const data = {
      ...validDateData,
      periodStart: '2030-12-31'
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(false);
    expect(typeof validation.getErrors().periodStart).toBe('string');
  });

  it('should return false when periodEnd is not after periodStart', () => {
    const data = {
      ...validDateData,
      periodStart: '2024-01-31',
      periodEnd: '2024-01-15'
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(false);
    expect(typeof validation.getErrors().periodEnd).toBe('string');
  });

  it('should return false when periodEnd is after today', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const futureDate = tomorrow.toISOString().split('T')[0];

    const data = {
      ...validDateData,
      periodEnd: futureDate
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(false);
    expect(typeof validation.getErrors().periodEnd).toBe('string');
  });

  it('should return false when dueDate is not after periodEnd', () => {
    const data = {
      ...validDateData,
      periodEnd: '2024-01-31',
      dueDate: '2024-01-30'
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(false);
    expect(typeof validation.getErrors().dueDate).toBe('string');
  });

  it('should return true when periodStart is empty', () => {
    const data = {
      ...validDateData,
      periodStart: ''
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(true);
  });

  it('should return true when periodEnd is empty', () => {
    const data = {
      ...validDateData,
      periodEnd: ''
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(true);
  });

  it('should return true when dueDate is empty', () => {
    const data = {
      ...validDateData,
      dueDate: ''
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(true);
  });

  it('should handle multiple date validation errors', () => {
    const futureDate = '2030-12-31';
    const data = {
      periodStart: futureDate,
      periodEnd: futureDate,
      dueDate: '2024-01-01' // before period end
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(false);
    expect(typeof validation.getErrors().periodStart).toBe('string');
    expect(typeof validation.getErrors().periodEnd).toBe('string');
  });

  it('should accept today as periodEnd', () => {
    const today = new Date().toISOString().split('T')[0];
    const data = {
      ...validDateData,
      periodEnd: today
    };

    const result = validation.validateDateLogic(data);

    expect(result).toBe(true);
    expect(validation.getErrors().periodEnd).toBeUndefined();
  });
});

describe('Function validateMonetaryValues', () => {
  let validation: GeneralDataValidation;
  let validSingleData: IMonetaryValidationData;
  let validMultipleData: IMonetaryValidationData;

  beforeEach(() => {
    validation = new GeneralDataValidation();

    validSingleData = {
      billValue: 100
    };

    validMultipleData = {
      unit: 'kWh',
      unitCost: 50
    };
  });

  it('should return true for valid single meter data', () => {
    const result = validation.validateMonetaryValues(validSingleData, 'single');

    expect(result).toBe(true);
    expect(validation.hasErrors()).toBe(false);
  });

  it('should return true for valid multiple meter data', () => {
    const result = validation.validateMonetaryValues(validMultipleData, 'multiple');

    expect(result).toBe(true);
    expect(validation.hasErrors()).toBe(false);
  });

  it('should return false when billValue is less than 1 for single meter', () => {
    const data = { billValue: 0.5 };

    const result = validation.validateMonetaryValues(data, 'single');

    expect(result).toBe(false);
    expect(typeof validation.getErrors().billValue).toBe('string');
  });

  it('should return false when billValue is zero for single meter', () => {
    const data = { billValue: 0 };

    const result = validation.validateMonetaryValues(data, 'single');

    expect(result).toBe(false);
    expect(typeof validation.getErrors().billValue).toBe('string');
  });

  it('should return false when billValue is negative for single meter', () => {
    const data = { billValue: -10 };

    const result = validation.validateMonetaryValues(data, 'single');

    expect(result).toBe(false);
    expect(typeof validation.getErrors().billValue).toBe('string');
  });

  it('should return true when billValue equals 1 for single meter', () => {
    const data = { billValue: 1 };

    const result = validation.validateMonetaryValues(data, 'single');

    expect(result).toBe(true);
    expect(validation.getErrors().billValue).toBeUndefined();
  });

  it('should return false when unit is empty for multiple meter', () => {
    const data = { unit: '', unitCost: 50 };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(false);
    expect(typeof validation.getErrors().unit).toBe('string');
  });

  it('should return false when unit is null for multiple meter', () => {
    const data = { unit: null as any, unitCost: 50 };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(false);
  expect(typeof validation.getErrors().unit).toBe('string');
  });

  it('should return false when unitCost is less than 1 for multiple meter', () => {
    const data = { unit: 'kWh', unitCost: 0.5 };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(false);
  expect(typeof validation.getErrors().unitCost).toBe('string');
  });

  it('should return false when unitCost is zero for multiple meter', () => {
    const data = { unit: 'kWh', unitCost: 0 };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(false);
  expect(typeof validation.getErrors().unitCost).toBe('string');
  });

  it('should return false when unitCost is negative for multiple meter', () => {
    const data = { unit: 'kWh', unitCost: -5 };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(false);
  expect(typeof validation.getErrors().unitCost).toBe('string');
  });

  it('should return true when unitCost equals 1 for multiple meter', () => {
    const data = { unit: 'kWh', unitCost: 1 };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(true);
    expect(validation.getErrors().unitCost).toBeUndefined();
  });

  it('should handle multiple errors for multiple meter', () => {
    const data = { unit: '', unitCost: 0 };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(false);
  expect(typeof validation.getErrors().unit).toBe('string');
  expect(typeof validation.getErrors().unitCost).toBe('string');
  });

  it('should accept string numbers for billValue in single meter', () => {
    const data = { billValue: '100' };

    const result = validation.validateMonetaryValues(data, 'single');

    expect(result).toBe(true);
    expect(validation.getErrors().billValue).toBeUndefined();
  });

  it('should accept string numbers for unitCost in multiple meter', () => {
    const data = { unit: 'kWh', unitCost: '50' };

    const result = validation.validateMonetaryValues(data, 'multiple');

    expect(result).toBe(true);
    expect(validation.getErrors().unitCost).toBeUndefined();
  });
});

describe('Function validateServiceSelection', () => {
  let validation: GeneralDataValidation;
  let validServiceData: IServiceValidationData;

  beforeEach(() => {
    validation = new GeneralDataValidation();

    validServiceData = {
      serviceOption: 'Agua',
      serviceName: 'Test Service'
    };
  });

  it('should return true for valid service option selection', () => {
    const result = validation.validateServiceSelection(validServiceData);

    expect(result).toBe(true);
    expect(validation.hasErrors()).toBe(false);
  });

  it('should return true when serviceOption is "Otro" with valid serviceName', () => {
    const data = {
      serviceOption: 'Otro',
      serviceName: 'Custom Service Name'
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(true);
    expect(validation.hasErrors()).toBe(false);
  });

  it('should return false when serviceOption is empty', () => {
    const data = {
      ...validServiceData,
      serviceOption: ''
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(false);
  expect(typeof validation.getErrors().serviceOption).toBe('string');
  });

  it('should return false when serviceOption is null', () => {
    const data = {
      ...validServiceData,
      serviceOption: null as any
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(false);
  expect(typeof validation.getErrors().serviceOption).toBe('string');
  });

  it('should return false when serviceOption is undefined', () => {
    const data = {
      ...validServiceData,
      serviceOption: undefined as any
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(false);
  expect(typeof validation.getErrors().serviceOption).toBe('string');
  });

  it('should return false when serviceOption is "Otro" but serviceName is empty', () => {
    const data = {
      serviceOption: 'Otro',
      serviceName: ''
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(false);
  expect(typeof validation.getErrors().serviceName).toBe('string');
  });

  it('should return false when serviceOption is "Otro" but serviceName is null', () => {
    const data = {
      serviceOption: 'Otro',
      serviceName: null as any
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(false);
  expect(typeof validation.getErrors().serviceName).toBe('string');
  });

  it('should return false when serviceOption is "Otro" but serviceName is whitespace only', () => {
    const data = {
      serviceOption: 'Otro',
      serviceName: '   '
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(false);
  expect(typeof validation.getErrors().serviceName).toBe('string');
  });

  it('should accept any valid serviceOption other than empty or "Otro"', () => {
    const serviceOptions = ['Agua', 'Luz', 'Gas', 'Internet', 'Condominio'];

    serviceOptions.forEach(option => {
      validation.clearErrors();
      const data = {
        serviceOption: option,
        serviceName: 'Any name' // should be ignored
      };

      const result = validation.validateServiceSelection(data);

      expect(result).toBe(true);
      expect(validation.hasErrors()).toBe(false);
    });
  });

  it('should not validate serviceName when serviceOption is not "Otro"', () => {
    const data = {
      serviceOption: 'Agua',
      serviceName: '' // empty but should be ignored
    };

    const result = validation.validateServiceSelection(data);

    expect(result).toBe(true);
    expect(validation.getErrors().serviceName).toBeUndefined();
  });
});
