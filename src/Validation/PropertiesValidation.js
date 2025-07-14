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
   * @param {Object} data - Property data
   * @param {Object} uiState - UI state
   * @returns {Object} Validation result
   */
  validateAddProperty(data, uiState = {}) {
    this.clearErrors();
    let isValid = true;

    // Validate property name
    if (!this.validateRequired(data.propertyName, 'propertyName', 'Property name is required')) {
      isValid = false;
    }

    // Validate liquidation method if visible
    if (uiState.showLiquidationMethod) {
      if (!this.validateRequired(data.liquidationMethod, 'liquidationMethod', 'Must select a liquidation method')) {
        isValid = false;
      }
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

    if (!isValid) {
      this.addError('properties', 'Must add at least one property');
      this.setValidState(false);
      return this.getValidationResult();
    }

    const percentageProperties = properties.filter(p => p.liquidationMethod === 'PERCENTAGE');
    const peopleProperties = properties.filter(p => p.liquidationMethod === 'PEOPLE');

    if (isMultipleMeter) {
      // For multiple meter, validate that all values are >= 1
      properties.forEach((property, index) => {
        if (!this.validateMinNumber(property.value, `property_${index}_value`, 1, 'Must be greater than or equal to 1')) {
          isValid = false;
        }
      });
    } else {
      // For single meter, validate by method

      // Validate properties with people method
      peopleProperties.forEach((property, index) => {
        if (!this.validateMinNumber(property.value, `people_${index}_value`, 1, 'Must be greater than or equal to 1')) {
          isValid = false;
        }
      });

      // Validate properties with percentage method
      percentageProperties.forEach((property, index) => {
        const value = parseFloat(property.value);
        
        if (isNaN(value) || value < 1 || value > 100) {
          this.addError(`percentage_${index}_value`, 'Must be a percentage between 1 and 100');
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
            this.addError(`percentage_${index}_value`, 'Total must sum exactly 100% if there are no other methods');
          });
        }

        if (peopleProperties.length > 0 && (percentageTotal <= 0 || percentageTotal >= 100)) {
          isValid = false;
          percentageProperties.forEach((property, index) => {
            this.addError(`percentage_${index}_value`, 'Percentage total must be greater than 0% and less than 100% if there are other methods');
          });
        }
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates an individual property value based on its method
   * @param {number} value - Value to validate
   * @param {string} method - Liquidation method
   * @param {string} fieldName - Field name for errors
   * @returns {Object}
   */
  validatePropertyValue(value, method, fieldName) {
    this.clearErrors();
    let isValid = true;

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      this.addError(fieldName, 'Field cannot be empty');
      isValid = false;
    } else if (method === 'PEOPLE') {
      if (numValue < 1) {
        this.addError(fieldName, 'Must be greater than or equal to 1');
        isValid = false;
      }
    } else if (method === 'PERCENTAGE') {
      if (numValue < 1 || numValue > 100) {
        this.addError(fieldName, 'Must be a percentage between 1 and 100');
        isValid = false;
      }
    }

    if (isValid) {
      this.addError(fieldName, '');
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates that the property name is not duplicated
   * @param {string} propertyName - Property name
   * @param {Array} existingProperties - Existing properties
   * @returns {Object}
   */
  validateUniquePropertyName(propertyName, existingProperties) {
    this.clearErrors();
    let isValid = true;

    if (!this.validateRequired(propertyName, 'propertyName', 'Property name is required')) {
      isValid = false;
    } else {
      // Check that no property with the same name exists
      const isDuplicate = existingProperties.some(
        property => property.name.toLowerCase().trim() === propertyName.toLowerCase().trim()
      );

      if (isDuplicate) {
        this.addError('propertyName', 'A property with this name already exists');
        isValid = false;
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates only the property name (without checking duplicates)
   * @param {string} propertyName - Property name
   * @returns {Object}
   */
  validatePropertyName(propertyName) {
    this.clearErrors();
    const isValid = this.validateRequired(propertyName, 'propertyName', 'Property name is required');
    
    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the liquidation method selection
   * @param {string} method - Selected method
   * @returns {Object}
   */
  validateLiquidationMethod(method) {
    this.clearErrors();
    const isValid = this.validateRequired(method, 'liquidationMethod', 'Must select a liquidation method');
    
    this.setValidState(isValid);
    return this.getValidationResult();
  }
}
