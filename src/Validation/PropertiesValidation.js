import validator from 'validator';
import { ValidationBase } from './ValidationBase.js';

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
  validateAddProperty(data, existingProperties = []) {
    this.clearErrors();
    let isValid = true;

    // Validate property name
    if (!this.validateRequired(data.propertyName, 'propertyName', 'El nombre de la propiedad es requerido')) {
      isValid = false;
    } else {
      // Check for duplicate property names
      const isDuplicate = existingProperties.some(
        property => property.name.toLowerCase().trim() === data.propertyName.toLowerCase().trim()
      );

      if (isDuplicate) {
        this.addError('propertyName', 'Ya existe una propiedad con este nombre');
        isValid = false;
      }
    }

    // Validate liquidation method
    if (!this.validateRequired(data.liquidationMethod, 'liquidationMethod', 'Debe seleccionar un método de liquidación')) {
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
  validatePropertiesTable(properties, isMultipleMeter = false) {
    this.clearErrors();
    let isValid = properties.length > 0;
    let percentageTotal = 0;

    const percentageProperties = properties.filter(p => p.method === 'PERCENTAGE');
    const peopleProperties = properties.filter(p => p.method === 'PEOPLE');

    if (isMultipleMeter) {
      // For multiple meter, validate that all values are >= 1
      properties.forEach((property, index) => {
        if (!this.validateMinNumber(property.baseValue, `property_${index}_value`, 1, 'Debe ser mayor o igual a 1')) {
          isValid = false;
        }
      });
    } else {
      // For single meter, validate by method

      // Validate properties with people method
      peopleProperties.forEach((property, index) => {
        if (!this.validateMinNumber(property.baseValue, `people_${index}_value`, 1, 'Debe ser mayor o igual a 1')) {
          isValid = false;
        }
      });

      // Validate properties with percentage method
      percentageProperties.forEach((property, index) => {
        const value = parseFloat(property.baseValue);
        
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
          percentageProperties.forEach((property, index) => {
            this.addError(`percentage_${index}_value`, 'El total debe sumar exactamente 100% si no hay otros métodos');
          });
        }

        if (peopleProperties.length > 0 && (percentageTotal <= 0 || percentageTotal >= 100)) {
          isValid = false;
          percentageProperties.forEach((property, index) => {
            this.addError(`percentage_${index}_value`, 'El total de porcentajes debe ser mayor a 0% y menor a 100% si hay otros métodos');
          });
        }
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

}
