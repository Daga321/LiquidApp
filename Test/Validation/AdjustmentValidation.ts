import { describe, it, expect, beforeEach } from 'vitest';
import { AdjustmentValidation } from '../../src/Validation/AdjustmentValidation';
import { IAdjustmentFormValidation } from '../../Types/Validation/AdjustmentValidation';
import { IAdjustment } from '../../Types/Models/Adjustment';
import { IAdjustmentType } from '../../Types/Models/Enums/AdjustmentTypeEnum';

describe('Function validate', () => {
  let validation: AdjustmentValidation;
  let validFormData: IAdjustmentFormValidation;
  let existingAdjustments: IAdjustment[];
  let adjustmentType: IAdjustmentType;

  beforeEach(() => {
    validation = new AdjustmentValidation();
    adjustmentType = { Key: 'DISCOUNT', Value: 'Descuento' };
    
    validFormData = {
      adjustmentName: 'Test Adjustment',
      adjustmentAmount: 100,
      adjustmentType: 'DISCOUNT',
      selectedPropertyId: 'property-1',
      applyToAll: false
    };

    existingAdjustments = [
      {
        note: 'Existing Adjustment',
        value: 50,
        type: adjustmentType
      }
    ];
  });

  it('should return valid result for complete valid form data', () => {
    const result = validation.validate(validFormData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return valid result when applyToAll is true without selectedPropertyId', () => {
    const formData = {
      ...validFormData,
      applyToAll: true,
      selectedPropertyId: ''
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
  });

  it('should add error when selectedPropertyId is empty and applyToAll is false', () => {
    const formData = {
      ...validFormData,
      selectedPropertyId: '',
      applyToAll: false
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.selectedPropertyId).toBe('Por favor seleccione una propiedad');
  });

  it('should add error when adjustmentName is empty', () => {
    const formData = {
      ...validFormData,
      adjustmentName: ''
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentName).toBe('El concepto del ajuste es requerido');
  });

  it('should add error when adjustmentName is null', () => {
    const formData = {
      ...validFormData,
      adjustmentName: null as any
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentName).toBe('El concepto del ajuste es requerido');
  });

  it('should add error when adjustmentName is whitespace only', () => {
    const formData = {
      ...validFormData,
      adjustmentName: '   '
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentName).toBe('El concepto del ajuste es requerido');
  });

  it('should add error when adjustmentName already exists (case insensitive)', () => {
    const formData = {
      ...validFormData,
      adjustmentName: 'EXISTING ADJUSTMENT' // uppercase version of existing
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentName).toBe('Ya existe un ajuste con este concepto');
  });

  it('should add error when adjustmentName already exists (exact match)', () => {
    const formData = {
      ...validFormData,
      adjustmentName: 'Existing Adjustment'
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentName).toBe('Ya existe un ajuste con este concepto');
  });

  it('should not add error when adjustmentName is unique', () => {
    const formData = {
      ...validFormData,
      adjustmentName: 'Unique Adjustment Name'
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(true);
    expect(result.errors.adjustmentName).toBeUndefined();
  });

  it('should add error when adjustmentAmount is zero', () => {
    const formData = {
      ...validFormData,
      adjustmentAmount: 0
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentAmount).toBe('El valor debe ser mayor a 0');
  });

  it('should add error when adjustmentAmount is negative', () => {
    const formData = {
      ...validFormData,
      adjustmentAmount: -10
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentAmount).toBe('El valor debe ser mayor a 0');
  });

  it('should add error when adjustmentAmount is null', () => {
    const formData = {
      ...validFormData,
      adjustmentAmount: null as any
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentAmount).toBe('El valor del ajuste es requerido');
  });

  it('should add error when adjustmentAmount is NaN', () => {
    const formData = {
      ...validFormData,
      adjustmentAmount: NaN
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentAmount).toBe('El valor del ajuste es requerido');
  });

  it('should accept valid adjustmentAmount with minimum value', () => {
    const formData = {
      ...validFormData,
      adjustmentAmount: 0.01
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(true);
    expect(result.errors.adjustmentAmount).toBeUndefined();
  });

  it('should accept valid adjustmentAmount with decimal value', () => {
    const formData = {
      ...validFormData,
      adjustmentAmount: 99.99
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(true);
    expect(result.errors.adjustmentAmount).toBeUndefined();
  });

  it('should add error when adjustmentType is empty', () => {
    const formData = {
      ...validFormData,
      adjustmentType: ''
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentType).toBe('Debe seleccionar si es un cargo adicional o un descuento');
  });

  it('should add error when adjustmentType is null', () => {
    const formData = {
      ...validFormData,
      adjustmentType: null as any
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentType).toBe('Debe seleccionar si es un cargo adicional o un descuento');
  });

  it('should add error when adjustmentType is whitespace only', () => {
    const formData = {
      ...validFormData,
      adjustmentType: '   '
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.adjustmentType).toBe('Debe seleccionar si es un cargo adicional o un descuento');
  });

  it('should handle multiple validation errors simultaneously', () => {
    const formData = {
      adjustmentName: '',
      adjustmentAmount: 0,
      adjustmentType: '',
      selectedPropertyId: '',
      applyToAll: false
    };
    
    const result = validation.validate(formData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(false);
    expect(result.hasErrors).toBe(true);
    expect(result.errors.selectedPropertyId).toBe('Por favor seleccione una propiedad');
    expect(result.errors.adjustmentName).toBe('El concepto del ajuste es requerido');
    expect(result.errors.adjustmentAmount).toBe('El valor del ajuste es requerido');
    expect(result.errors.adjustmentType).toBe('Debe seleccionar si es un cargo adicional o un descuento');
  });

  it('should work with empty existingAdjustments array', () => {
    const result = validation.validate(validFormData, [], 5);
    
    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
  });

  it('should work with default parameters when not provided', () => {
    const result = validation.validate(validFormData);
    
    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
  });

  it('should clear previous errors before validation', () => {
    // First validation with errors
    const invalidFormData = {
      ...validFormData,
      adjustmentName: ''
    };
    validation.validate(invalidFormData, existingAdjustments, 5);
    
    // Second validation with valid data
    const result = validation.validate(validFormData, existingAdjustments, 5);
    
    expect(result.isValid).toBe(true);
    expect(result.hasErrors).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
