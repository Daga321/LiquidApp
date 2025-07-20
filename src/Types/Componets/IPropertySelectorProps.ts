import { IProperty } from '../Models/Property';

/**
 * Props interface for PropertySelector component
 */
export interface IPropertySelectorProps {
    properties: IProperty[];
    selectedPropertyId: string;
    onPropertyChange: (propertyId: string) => void;
    disabled?: boolean;
    errors: Record<string, string>;
    includeAllOption?: boolean;
}
