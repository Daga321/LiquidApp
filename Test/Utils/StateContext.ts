import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, act } from '@testing-library/react';
import { StateProvider, useStateContext } from '../../src/Utils/StateContext';
import { IProperty } from '../../Types/Models/Property';
import { IAdjustment } from '../../Types/Models/Adjustment';
import { IInvoice } from '../../Types/Models/Invoice';
import { ILiquidationMethod } from '../../Types/Models/Enums/LiquidationMethodEnum';
import { IAdjustmentType } from '../../Types/Models/Enums/AdjustmentTypeEnum';

// Mock data para pruebas
const mockLiquidationMethod: ILiquidationMethod = {
  Key: 'TEST_METHOD',
  Method: 'Test Method',
  InputPlaceHolder: 'Enter test value'
};

const mockAdjustmentType: IAdjustmentType = {
  Key: 'TEST_ADJUSTMENT',
  Value: 'Test Adjustment'
};

const mockProperty: IProperty = {
  name: 'Test Property',
  method: mockLiquidationMethod,
  baseValue: 1000,
  amountToPay: 800,
  adjustmentValue: 200,
  totalToPay: 1200,
  adjustmentsList: []
};

const mockAdjustment: IAdjustment = {
  note: 'Test Adjustment',
  value: 100,
  type: mockAdjustmentType
};

const mockInvoiceUpdate = {
  serviceName: 'Updated Service',
  billValue: 1500
};

// Componente de prueba para acceder al context
interface TestComponentProps {
  onStateChange?: (state: any) => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ onStateChange }) => {
  const context = useStateContext();
  
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange(context);
    }
  }, [context, onStateChange]);

  return <div data-testid="test-component">Test Component</div>;
};

// Helper para renderizar con provider
const renderWithProvider = (onStateChange?: (state: any) => void) => {
  return render(
    <StateProvider>
      <TestComponent onStateChange={onStateChange} />
    </StateProvider>
  );
};

describe('StateContext', () => {
  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      expect(capturedState.data.invoice).toEqual({
        serviceName: "",
        serviceOption: "",
        billValue: 0,
        valuePerPeople: 0,
        unit: "",
        periodStart: undefined,
        periodEnd: undefined,
        dueDate: undefined,
        unitCost: 0,
        singleMeter: true
      });
      expect(capturedState.data.properties).toEqual([]);
    });

    it('should provide all required helper functions', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      // Property helpers
      expect(typeof capturedState.addProperty).toBe('function');
      expect(typeof capturedState.removeProperty).toBe('function');
      expect(typeof capturedState.updateProperty).toBe('function');
      
      // Adjustment helpers
      expect(typeof capturedState.addAdjustment).toBe('function');
      expect(typeof capturedState.removeAdjustment).toBe('function');
      expect(typeof capturedState.updateAdjustment).toBe('function');
      expect(typeof capturedState.moveAdjustment).toBe('function');
      
      // Invoice helpers
      expect(typeof capturedState.updateInvoice).toBe('function');
      
      // General helpers
      expect(typeof capturedState.handleChange).toBe('function');
      expect(typeof capturedState.setData).toBe('function');
    });
  });

  describe('addProperty', () => {
    it('should add property with default values when no data provided', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty();
      });

      expect(capturedState.data.properties).toHaveLength(1);
      
      const addedProperty = capturedState.data.properties[0];
      expect(addedProperty.name).toBe('');
      expect(addedProperty.method).toEqual({});
      expect(addedProperty.baseValue).toBe(0);
      expect(addedProperty.amountToPay).toBe(0);
      expect(addedProperty.adjustmentValue).toBe(0);
      expect(addedProperty.totalToPay).toBe(0);
      expect(addedProperty.adjustmentsList).toEqual([]);
    });

    it('should add property with provided partial data', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      const partialProperty = {
        name: 'Partial Property',
        baseValue: 500
      };

      act(() => {
        capturedState.addProperty(partialProperty);
      });

      expect(capturedState.data.properties).toHaveLength(1);
      
      const addedProperty = capturedState.data.properties[0];
      expect(addedProperty.name).toBe('Partial Property');
      expect(addedProperty.baseValue).toBe(500);
      expect(addedProperty.method).toEqual({});
      expect(addedProperty.amountToPay).toBe(0);
    });

    it('should add property with complete data', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      expect(capturedState.data.properties).toHaveLength(1);
      expect(capturedState.data.properties[0]).toEqual(mockProperty);
    });

    it('should add multiple properties maintaining order', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      const property1 = { name: 'Property 1' };
      const property2 = { name: 'Property 2' };

      act(() => {
        capturedState.addProperty(property1);
        capturedState.addProperty(property2);
      });

      expect(capturedState.data.properties).toHaveLength(2);
      expect(capturedState.data.properties[0].name).toBe('Property 1');
      expect(capturedState.data.properties[1].name).toBe('Property 2');
    });

    it('should not affect invoice data when adding property', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      const originalInvoice = { ...capturedState.data.invoice };

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      expect(capturedState.data.invoice).toEqual(originalInvoice);
    });

    it('should handle null property data', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(null);
      });

      expect(capturedState.data.properties).toHaveLength(1);
      
      const addedProperty = capturedState.data.properties[0];
      expect(addedProperty.name).toBe('');
      expect(addedProperty.baseValue).toBe(0);
    });
  });

  describe('removeProperty', () => {
    beforeEach(() => {
      // Este describe block mostraría cómo testear removeProperty
      // Se seguiría el mismo patrón que addProperty
    });

    it('should remove property at specified index', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      // Setup: Add properties first
      act(() => {
        capturedState.addProperty({ name: 'Property 1' });
        capturedState.addProperty({ name: 'Property 2' });
        capturedState.addProperty({ name: 'Property 3' });
      });

      // Test: Remove middle property
      act(() => {
        capturedState.removeProperty(1);
      });

      expect(capturedState.data.properties).toHaveLength(2);
      expect(capturedState.data.properties[0].name).toBe('Property 1');
      expect(capturedState.data.properties[1].name).toBe('Property 3');
    });

    it('should remove first property correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty({ name: 'Property 1' });
        capturedState.addProperty({ name: 'Property 2' });
      });

      act(() => {
        capturedState.removeProperty(0);
      });

      expect(capturedState.data.properties).toHaveLength(1);
      expect(capturedState.data.properties[0].name).toBe('Property 2');
    });

    it('should remove last property correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty({ name: 'Property 1' });
        capturedState.addProperty({ name: 'Property 2' });
      });

      act(() => {
        capturedState.removeProperty(1);
      });

      expect(capturedState.data.properties).toHaveLength(1);
      expect(capturedState.data.properties[0].name).toBe('Property 1');
    });

    it('should handle removing from single-item array', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty({ name: 'Only Property' });
      });

      act(() => {
        capturedState.removeProperty(0);
      });

      expect(capturedState.data.properties).toHaveLength(0);
      expect(capturedState.data.properties).toEqual([]);
    });

    it('should not affect invoice data when removing property', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty({ name: 'Property 1' });
      });

      const originalInvoice = { ...capturedState.data.invoice };

      act(() => {
        capturedState.removeProperty(0);
      });

      expect(capturedState.data.invoice).toEqual(originalInvoice);
    });
  });

  describe('updateProperty', () => {
    it('should update specific field of property at index', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(mockProperty);
        capturedState.addProperty({ name: 'Property 2' });
      });

      act(() => {
        capturedState.updateProperty(0, 'name', 'Updated Property Name');
      });

      expect(capturedState.data.properties[0].name).toBe('Updated Property Name');
      expect(capturedState.data.properties[0].baseValue).toBe(mockProperty.baseValue); // Other fields unchanged
      expect(capturedState.data.properties[1].name).toBe('Property 2'); // Other properties unchanged
    });

    it('should update numeric field correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      act(() => {
        capturedState.updateProperty(0, 'baseValue', 2000);
      });

      expect(capturedState.data.properties[0].baseValue).toBe(2000);
      expect(capturedState.data.properties[0].name).toBe(mockProperty.name); // Other fields unchanged
    });

    it('should update object field correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      const newMethod: ILiquidationMethod = {
        Key: 'NEW_METHOD',
        Method: 'New Method',
        InputPlaceHolder: 'New placeholder'
      };

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      act(() => {
        capturedState.updateProperty(0, 'method', newMethod);
      });

      expect(capturedState.data.properties[0].method).toEqual(newMethod);
      expect(capturedState.data.properties[0].name).toBe(mockProperty.name); // Other fields unchanged
    });

    it('should update array field correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      const newAdjustmentsList = [mockAdjustment];

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      act(() => {
        capturedState.updateProperty(0, 'adjustmentsList', newAdjustmentsList);
      });

      expect(capturedState.data.properties[0].adjustmentsList).toEqual(newAdjustmentsList);
      expect(capturedState.data.properties[0].name).toBe(mockProperty.name); // Other fields unchanged
    });

    it('should not affect other properties when updating one', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty({ name: 'Property 1', baseValue: 100 });
        capturedState.addProperty({ name: 'Property 2', baseValue: 200 });
        capturedState.addProperty({ name: 'Property 3', baseValue: 300 });
      });

      act(() => {
        capturedState.updateProperty(1, 'name', 'Updated Property 2');
      });

      expect(capturedState.data.properties[0].name).toBe('Property 1');
      expect(capturedState.data.properties[0].baseValue).toBe(100);
      expect(capturedState.data.properties[1].name).toBe('Updated Property 2');
      expect(capturedState.data.properties[1].baseValue).toBe(200); // baseValue unchanged
      expect(capturedState.data.properties[2].name).toBe('Property 3');
      expect(capturedState.data.properties[2].baseValue).toBe(300);
    });

    it('should not affect invoice data when updating property', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      const originalInvoice = { ...capturedState.data.invoice };

      act(() => {
        capturedState.updateProperty(0, 'name', 'Updated Name');
      });

      expect(capturedState.data.invoice).toEqual(originalInvoice);
    });
  });

  describe('addAdjustment', () => {
    it('should add adjustment to specified property', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      act(() => {
        capturedState.addAdjustment(0, mockAdjustment);
      });

      expect(capturedState.data.properties[0].adjustmentsList).toHaveLength(1);
      expect(capturedState.data.properties[0].adjustmentsList[0]).toEqual(mockAdjustment);
    });

    it('should add multiple adjustments to same property', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      const adjustment1 = { ...mockAdjustment, note: 'Adjustment 1' };
      const adjustment2 = { ...mockAdjustment, note: 'Adjustment 2' };

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      act(() => {
        capturedState.addAdjustment(0, adjustment1);
        capturedState.addAdjustment(0, adjustment2);
      });

      expect(capturedState.data.properties[0].adjustmentsList).toHaveLength(2);
      expect(capturedState.data.properties[0].adjustmentsList[0]).toEqual(adjustment1);
      expect(capturedState.data.properties[0].adjustmentsList[1]).toEqual(adjustment2);
    });

    it('should add adjustment to correct property when multiple properties exist', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty({ name: 'Property 1' });
        capturedState.addProperty({ name: 'Property 2' });
      });

      act(() => {
        capturedState.addAdjustment(1, mockAdjustment);
      });

      expect(capturedState.data.properties[0].adjustmentsList).toHaveLength(0);
      expect(capturedState.data.properties[1].adjustmentsList).toHaveLength(1);
      expect(capturedState.data.properties[1].adjustmentsList[0]).toEqual(mockAdjustment);
    });

    it('should not affect other properties when adding adjustment', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty({ name: 'Property 1' });
        capturedState.addProperty({ name: 'Property 2' });
      });

      const originalProperty1 = { ...capturedState.data.properties[0] };

      act(() => {
        capturedState.addAdjustment(1, mockAdjustment);
      });

      expect(capturedState.data.properties[0]).toEqual(originalProperty1);
    });

    it('should not affect invoice data when adding adjustment', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      const originalInvoice = { ...capturedState.data.invoice };

      act(() => {
        capturedState.addAdjustment(0, mockAdjustment);
      });

      expect(capturedState.data.invoice).toEqual(originalInvoice);
    });
  });

  describe('updateInvoice', () => {
    it('should update specific invoice field', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.updateInvoice('serviceName', 'New Service');
      });

      expect(capturedState.data.invoice.serviceName).toBe('New Service');
      expect(capturedState.data.invoice.billValue).toBe(0); // Other fields unchanged
    });

    it('should update numeric field correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.updateInvoice('billValue', 1500);
      });

      expect(capturedState.data.invoice.billValue).toBe(1500);
      expect(capturedState.data.invoice.serviceName).toBe(''); // Other fields unchanged
    });

    it('should update boolean field correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.updateInvoice('singleMeter', false);
      });

      expect(capturedState.data.invoice.singleMeter).toBe(false);
    });

    it('should update date field correctly', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      const testDate = new Date('2024-01-15');

      act(() => {
        capturedState.updateInvoice('dueDate', testDate);
      });

      expect(capturedState.data.invoice.dueDate).toBe(testDate);
    });

    it('should not affect properties data when updating invoice', () => {
      let capturedState: any;
      
      renderWithProvider((state) => {
        capturedState = state;
      });

      act(() => {
        capturedState.addProperty(mockProperty);
      });

      const originalProperties = [...capturedState.data.properties];

      act(() => {
        capturedState.updateInvoice('serviceName', 'New Service');
      });

      expect(capturedState.data.properties).toEqual(originalProperties);
    });
  });
});

// TEMPLATE PARA OTROS HELPERS:
/*
describe('removeAdjustment', () => {
  it('should remove adjustment at specified index from specified property', () => {
    // Setup con property y adjustments
    // Act: removeAdjustment
    // Assert: adjustment removido, otros intactos
  });

  it('should not affect other properties when removing adjustment', () => {
    // Verificar inmutabilidad
  });

  it('should handle removing from single-item adjustment list', () => {
    // Caso límite
  });
});

describe('updateAdjustment', () => {
  it('should update specific field of adjustment', () => {
    // Similar a updateProperty pero para adjustments
  });
});

describe('moveAdjustment', () => {
  it('should move adjustment within same property adjustments list', () => {
    // Verificar reordenamiento
  });

  it('should handle edge cases for move operations', () => {
    // Mover al inicio, final, mismo índice
  });
});
*/
