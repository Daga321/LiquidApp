import { ValidationBase } from './ValidationBase.js';
import { IValidationResult } from '../Types/Validation/ValidationBase.js';
import { IAdjustment } from '../Types/Models/Adjustment.js';
import { IAdjustmentFormValidation } from '../Types/Validation/AdjustmentValidation.js';

/**
 * Specific validation for adjustments form
 */
export class AdjustmentValidation extends ValidationBase {
  constructor() {
    super();
  }

  /**
   * Validates the adjustment form data
   * @param {IAdjustmentFormValidation} data - Form data to validate
   * @param {IAdjustment[]} existingAdjustments - Existing adjustments for uniqueness check
   * @param {number} propertiesCount - Total number of properties available
   * @returns {IValidationResult} Validation result
   */
  validate(data: IAdjustmentFormValidation, existingAdjustments: IAdjustment[] = [], propertiesCount: number = 0): IValidationResult {
    this.clearErrors();
    let isValid = true;

    // Validate property selection first (similar to service selection in GeneralDataForm)
    if (data.selectedPropertyId === "") {
        this.addError('selectedPropertyId', 'Por favor seleccione una propiedad');
        isValid = false;
      }

    // Validate adjustment name/concept
    if (!this.validateRequired(data.adjustmentName, 'adjustmentName', 'El concepto del ajuste es requerido')) {
      isValid = false;
    } else {
      // Check for duplicates
      if (existingAdjustments.some(adj => adj.note.toLowerCase() === data.adjustmentName.toLowerCase())) {
        this.addError('adjustmentName', 'Ya existe un ajuste con este concepto');
        isValid = false;
      }
    }

    // Validate adjustment value
    if (!this.validateRequired(data.adjustmentAmount, 'adjustmentAmount', 'El valor del ajuste es requerido')) {
      isValid = false;
    } else {
      if (!this.validateMinNumber(data.adjustmentAmount, 'adjustmentAmount', 0.01, 'El valor debe ser mayor a 0')) {
        isValid = false;
      }
    }

    // Validate adjustment type
    if (!this.validateRequired(data.adjustmentType, 'adjustmentType', 'Debe seleccionar si es un cargo adicional o un descuento')) {
      isValid = false;
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the form to add a new adjustment
   * @param {IAdjustment} data - Adjustment data
   * @returns {IValidationResult} Validation result
   */
  validateAddAdjustment(data: IAdjustment): IValidationResult {
    const formData: IAdjustmentFormValidation = {
      adjustmentName: data.note,
      adjustmentAmount: data.value,
      adjustmentType: data.type?.Key || '',
      selectedPropertyId: '', // This method doesn't have property context
      applyToAll: false
    };
    return this.validate(formData);
  }
}