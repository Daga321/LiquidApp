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
    if (!data.liquidationMethod) {
      this.addError('liquidationMethod', 'Debe seleccionar un método de liquidación');
      isValid = false;
    } else if (!this.validateRequired(data.liquidationMethod.Key, 'liquidationMethod', 'Debe seleccionar un método de liquidación')) {
      isValid = false;
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

  /**
   * Validates the complete properties table with their values
   * @param {Array} properties - Array of properties
   * @param {boolean} isSingleMeter - If it's single meter
   * @returns {Object} Validation result
   */
  validatePropertiesTable(properties: IPropertyValidation[], isSingleMeter: boolean = false): IValidationResult {
    this.clearErrors();
    let isValid = properties.length > 0;
    let percentageTotal = 0;

    const percentageProperties = properties.filter((p: IPropertyValidation) => p.method === 'PERCENTAGE');
    const consumptionProperties = properties.filter((p: IPropertyValidation) => p.method === 'CONSUMPTION');
    const peopleProperties = properties.filter((p: IPropertyValidation) => p.method === 'PEOPLE');
    const nonPercentageProperties = [...consumptionProperties, ...peopleProperties];

    if (!isSingleMeter) {
      // For multiple meter (consumption), validate that all values are >= 1 and integers
      properties.forEach((property: IPropertyValidation, index: number) => {
        const value = parseFloat(property.baseValue.toString());
        
        if (isNaN(value) || value < 1 || !Number.isInteger(value)) {
          this.addError(`property_${index}_value`, 'Debe ser un número entero mayor o igual a 1');
          isValid = false;
        }
      });
    } else {
      // For single meter, validate by method

      // Validate properties with consumption method
      consumptionProperties.forEach((property: IPropertyValidation, index: number) => {
        const value = parseFloat(property.baseValue.toString());
        const propertyIndex = properties.indexOf(property);
        
        if (isNaN(value) || value < 1 || !Number.isInteger(value)) {
          this.addError(`property_${propertyIndex}_value`, 'Debe ser un número entero mayor a 0');
          isValid = false;
        }
      });

      // Validate properties with people method
      peopleProperties.forEach((property: IPropertyValidation, index: number) => {
        const value = parseFloat(property.baseValue.toString());
        const propertyIndex = properties.indexOf(property);
        
        if (isNaN(value) || value < 1 || !Number.isInteger(value)) {
          this.addError(`property_${propertyIndex}_value`, 'Debe ser un número entero mayor a 0');
          isValid = false;
        }
      });

      // Validate properties with percentage method
      percentageProperties.forEach((property: IPropertyValidation, index: number) => {
        const value = parseFloat(property.baseValue.toString());
        const propertyIndex = properties.indexOf(property);
        
        if (isNaN(value) || value < 1 || value > 100 || !Number.isInteger(value)) {
          this.addError(`property_${propertyIndex}_value`, 'Debe ser un número entero entre 1 y 100');
          isValid = false;
        } else {
          percentageTotal += value;
        }
      });

      // Validate percentage sum rules
      if (percentageProperties.length > 0) {
        if (nonPercentageProperties.length === 0) {
          // Only percentage methods - must sum exactly 100%
          if (percentageTotal !== 100) {
            isValid = false;
            percentageProperties.forEach((property: IPropertyValidation) => {
              const propertyIndex = properties.indexOf(property);
              this.addError(`property_${propertyIndex}_value`, 'El total debe sumar exactamente 100% si no hay otros métodos');
            });
          }
        } else {
          // Mixed methods - percentage sum must be > 0 and < 100
          if (percentageTotal <= 0 || percentageTotal >= 100) {
            isValid = false;
            percentageProperties.forEach((property: IPropertyValidation) => {
              const propertyIndex = properties.indexOf(property);
              this.addError(`property_${propertyIndex}_value`, 'El total de porcentajes debe ser mayor a 0% y menor a 100% si hay otros métodos');
            });
          }
        }
      }
    }

    this.setValidState(isValid);
    return this.getValidationResult();
  }

}
