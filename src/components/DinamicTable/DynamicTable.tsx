import { useEffect, useRef, useMemo, Fragment } from "react";
import { ColumnDefinition, DynamicTableProps, ActionType } from "../../Types/Componets/DynamicTableTypes";
import { updateActions } from "./TableAnimation";
import "./Table.css";
import "./TableAnimations.css";

export function DynamicTable<T>({
  data,
  columns,
  renderRow,
  withActions = false,
  onAction,
  groupBy,
  actionPosition = "end",
}: DynamicTableProps<T>) {
  const tableRef = useRef<HTMLTableElement>(null);
  const tableId = useRef(`dynamic-table-${Math.random().toString(36).substr(2, 9)}`);

  // Agrupamiento de datos (si corresponde)
  const groupedData = useMemo(() => {
    if (!groupBy) return { all: data };
    return data.reduce<Record<string, T[]>>((acc, item) => {
      const key = String(item[groupBy] ?? "undefined");
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [data, groupBy]);

  // Reorganize columns when grouping - put groupBy column first
  const displayColumns = useMemo(() => {
    if (!groupBy) return columns;
    
    const groupColumn = columns.find(col => col.key === groupBy);
    const otherColumns = columns.filter(col => col.key !== groupBy);
    
    return groupColumn ? [groupColumn, ...otherColumns] : columns;
  }, [columns, groupBy]);

  // Handle move actions
  const handleMove = (fromIndex: number, toIndex: number) => {
    if (!onAction) return;
    
    // Find the item that was moved
    const flatData = Object.values(groupedData).flat();
    const movedItem = flatData[fromIndex];
    
    if (movedItem) {
      // Determine direction
      const direction = fromIndex < toIndex ? "down" : "up";
      onAction(direction as ActionType, movedItem);
    }
  };

  // Handle delete actions
  const handleDelete = (index: number) => {
    if (!onAction) return;
    
    const flatData = Object.values(groupedData).flat();
    const deletedItem = flatData[index];
    
    if (deletedItem) {
      onAction("delete", deletedItem);
    }
  };

  // Update actions when data changes
  useEffect(() => {
    if (withActions && tableRef.current) {
      updateActions({
        tableSelector: `#${tableId.current}`,
        onMove: handleMove,
        onDelete: handleDelete,
      });
    }
  }, [data, withActions]);

  const renderActions = (item: T, index: number) => (
    <td className="table-actions">
      <button 
        className="button action-button"
        onClick={() => onAction?.("up", item)}
        title="Mover arriba"
      >
        ↑
      </button>
      <button 
        className="button action-button"
        onClick={() => onAction?.("down", item)}
        title="Mover abajo"
      >
        ↓
      </button>
      <button 
        className="delete-btn"
        onClick={() => onAction?.("delete", item)}
        title="Eliminar"
      >
        🗑️
      </button>
    </td>
  );

  return (
    <div className="table-wrapper">
      <table 
        ref={tableRef}
        id={tableId.current}
        className="fixed-table"
      >
        <thead>
          <tr>
            {withActions && actionPosition === "start" && <th>Acciones</th>}
            {displayColumns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: col.width,
                  textAlign: col.align || "left",
                }}
              >
                {col.title}
              </th>
            ))}
            {withActions && actionPosition === "end" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([groupKey, items]) => (
            <Fragment key={groupKey}>
              {items.map((item, idx) => {
                const globalIndex = Object.values(groupedData)
                  .slice(0, Object.keys(groupedData).indexOf(groupKey))
                  .flat().length + idx;
                
                return (
                  <tr key={idx} data-property-index={groupKey}>
                    {withActions && actionPosition === "start" && renderActions(item, globalIndex)}
                    {groupBy && idx === 0 && (
                      <td 
                        rowSpan={items.length} 
                        style={{ 
                          textAlign: displayColumns[0]?.align || "left",
                          verticalAlign: "top"
                        }}
                      >
                        {groupKey}
                      </td>
                    )}
                    {renderRow(item, !!groupBy)}
                    {withActions && actionPosition === "end" && renderActions(item, globalIndex)}
                  </tr>
                );
              })}
            </Fragment>
          ))}
          {Object.values(groupedData).flat().length === 0 && (
            <tr className="empty-row">
              <td colSpan={displayColumns.length + (withActions ? 1 : 0)}>
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
