import { IPropertyFormData } from "../Validation/PropertiesValidation";

// Interface for component props
export interface IPropertiesFormProps {
    formData: IPropertyFormData;
    onFormDataChange: (field: string, value: string | number) => void;
    onAddProperty: () => void;
    errors?: Record<string, string>;
    canAddProperty?: boolean;
}