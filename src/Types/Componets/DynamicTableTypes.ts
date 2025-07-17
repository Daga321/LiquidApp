// Tipos para las columnas
export interface ColumnDefinition {
  key: string;
  title: string;
  width?: string | number;
  align?: "left" | "center" | "right";
}

// Props del componente
export interface DynamicTableProps<T> {
  data: T[];
  columns: ColumnDefinition[];
  renderRow: (item: T, skipGroupColumn?: boolean) => React.ReactNode;
  withActions?: boolean;
  onAction?: (action: "up" | "down" | "delete" | "edit", item: T) => void;
  groupBy?: keyof T;
  actionPosition?: "start" | "end";
}

// Types for table animations
export interface TableAnimationOptions {
  tableSelector: string;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDelete: (index: number) => void;
}

export type AnimationDirection = "up" | "down";
export type ActionType = "up" | "down" | "delete" | "edit";

// Export the component types for external use
export type { DynamicTableProps as IDynamicTableProps, ColumnDefinition as IColumnDefinition };
