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

  const renderActions = (item: T, index: number) => {
    // Just render the container, TableAnimation will fill it with buttons
    return (
      <td className="table-actions">
        {/* TableAnimation will populate this */}
      </td>
    );
  };

  return (
    <div className="table-wrapper">
      <table 
        ref={tableRef}
        id={tableId.current}
        className="fixed-table"
      >
        <thead>
          <tr>
            {withActions && actionPosition === "start" && <th style={{ width: '130px' }}>Acciones</th>}
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
            {withActions && actionPosition === "end" && <th style={{ width: '130px' }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([groupKey, items]) => (
            <Fragment key={groupKey}>
              {items.map((item, idx) => {
                const globalIndex = Object.values(groupedData)
                  .slice(0, Object.keys(groupedData).indexOf(groupKey))
                  .flat().length + idx;
                
                // Create a unique key for each row - use multiple properties for uniqueness
                const itemId = (item as any)?.id || (item as any)?.name || idx;
                const uniqueKey = groupBy 
                  ? `${groupKey}-${itemId}-${idx}` 
                  : `item-${itemId}-${globalIndex}`;
                
                return (
                  <tr key={uniqueKey} data-property-index={groupKey}>
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
