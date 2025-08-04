/**
 * Shared types for Stepper functionality
 */

// Type for the step setter function
export type StepSetter = ((value: number) => void) | null;

// Interface for current step reference
export interface CurrentStepRef {
    value: number;
    setter: StepSetter;
}

// Props for Stepper component
export interface StepperProps {
    step: number;
    views: string[];
}

// Type for views configuration
export type ViewsConfig = Record<string, React.ReactNode>;
