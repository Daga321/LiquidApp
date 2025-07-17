import { ValidationBase } from './ValidationBase.js';
import { IValidationResult } from '../Types/Validation/ValidationBase.js';
import { IPropertyFormData, IPropertyValidation } from '../Types/Validation/PropertiesValidation.js';

/**
 * Specific validation for properties form
 */
export class PropertiesValidation extends ValidationBase {
  constructor() {
    super();
  }

  /**
   * Validates the form to add a new property
   * @param {Object} data - Property data from the form
   * @param {Array} existingProperties - Array of existing properties to check for duplicates
   * @returns {Object} Validation result
   */
  validateAddProperty(data: IPropertyFormData, existingProperties: IPropertyValidation[] = []): IValidationResult {
    this.clearErrors();
    let isValid = true;

    // Validate property name
    if (!this.validateRequired(data.propertyName, 'propertyName', 'El nombre de la propiedad es requerido')) {
      isValid = false;
    } else {
      // Check for duplicate property names
      const isDuplicate = existingProperties.some(
        (property: IPropertyValidation) => property.name.toLowerCase().trim() === data.propertyName.toLowerCase().trim()
      );

      if (isDuplicate) {
        this.addError('propertyName', 'Ya existe una propiedad con este nombre');
        isValid = false;
      }
    }

    // Validate liquidation method
    if (!data.liquidationMethod || !this.validateRequired(data.liquidationMethod.Key, 'liquidationMethod', 'Debe seleccionar un método de liquidación')) {
      isValid = false;
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the complete properties table with their values
   * @param {Array} properties - Array of properties
   * @param {boolean} isMultipleMeter - If it's multiple meter
   * @returns {Object} Validation result
   */
  validatePropertiesTable(properties: IPropertyValidation[], isMultipleMeter: boolean = false): IValidationResult {
    this.clearErrors();
    let isValid = properties.length > 0;
    let percentageTotal = 0;

    const percentageProperties = properties.filter((p: IPropertyValidation) => p.method === 'PERCENTAGE');
    const peopleProperties = properties.filter((p: IPropertyValidation) => p.method === 'PEOPLE');

    if (isMultipleMeter) {
      // For multiple meter, validate that all values are >= 1
      properties.forEach((property: IPropertyValidation, index: number) => {
        if (!this.validateMinNumber(property.baseValue, `property_${index}_value`, 1, 'Debe ser mayor o igual a 1')) {
          isValid = false;
        }
      });
    } else {
      // For single meter, validate by method

      // Validate properties with people method
      peopleProperties.forEach((property: IPropertyValidation, index: number) => {
        if (!this.validateMinNumber(property.baseValue, `people_${index}_value`, 1, 'Debe ser mayor o igual a 1')) {
          isValid = false;
        }
      });

      // Validate properties with percentage method
      percentageProperties.forEach((property: IPropertyValidation, index: number) => {
        const value = parseFloat(property.baseValue.toString());
        
        if (isNaN(value) || value < 1 || value > 100) {
          this.addError(`percentage_${index}_value`, 'Debe ser un porcentaje entre 1 y 100');
          isValid = false;
        } else {
          percentageTotal += value;
          this.addError(`percentage_${index}_value`, '');
        }
      });

      // Validate percentage sum
      if (percentageProperties.length > 0) {
        if (peopleProperties.length === 0 && percentageTotal !== 100) {
          isValid = false;
          percentageProperties.forEach((property: IPropertyValidation, index: number) => {
            this.addError(`percentage_${index}_value`, 'El total debe sumar exactamente 100% si no hay otros métodos');
          });
        }

        if (peopleProperties.length > 0 && (percentageTotal <= 0 || percentageTotal >= 100)) {
          isValid = false;
          percentageProperties.forEach((property: IPropertyValidation, index: number) => {
            this.addError(`percentage_${index}_value`, 'El total de porcentajes debe ser mayor a 0% y menor a 100% si hay otros métodos');
          });
        }
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

}
