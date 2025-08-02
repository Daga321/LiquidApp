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
  allowMultipleRows = false,
}: DynamicTableProps<T>) {
  const tableRef = useRef<HTMLTableElement>(null);
  const tableId = useRef(`dynamic-table-${Math.random().toString(36).substr(2, 9)}`);

  // Determine which mode to use - groupBy takes precedence over allowMultipleRows
  const useGrouping = !!groupBy;
  const useMultipleRows = !useGrouping && allowMultipleRows;
  const groupedData = useMemo(() => {
    if (!useGrouping) return { all: data };
    return data.reduce<Record<string, T[]>>((acc, item) => {
      const key = String(item[groupBy] ?? "undefined");
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [data, groupBy, useGrouping]);

  // Reorganize columns when grouping - put groupBy column first
  const displayColumns = useMemo(() => {
    if (!useGrouping) return columns;
    
    const groupColumn = columns.find(col => col.key === groupBy);
    const otherColumns = columns.filter(col => col.key !== groupBy);
    
    return groupColumn ? [groupColumn, ...otherColumns] : columns;
  }, [columns, groupBy, useGrouping]);

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
          {useGrouping ? (
            // Existing grouping logic
            Object.entries(groupedData).map(([groupKey, items]) => (
              <Fragment key={groupKey}>
                {items.map((item, idx) => {
                  const globalIndex = Object.values(groupedData)
                    .slice(0, Object.keys(groupedData).indexOf(groupKey))
                    .flat().length + idx;
                  
                  // Create a unique key for each row - use multiple properties for uniqueness
                  const itemId = (item as any)?.id || (item as any)?.name || idx;
                  const uniqueKey = `${groupKey}-${itemId}-${idx}`;
                  
                  return (
                    <tr key={uniqueKey} data-property-index={groupKey}>
                      {withActions && actionPosition === "start" && renderActions(item, globalIndex)}
                      {idx === 0 && (
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
                      {renderRow(item, true)}
                      {withActions && actionPosition === "end" && renderActions(item, globalIndex)}
                    </tr>
                  );
                })}
              </Fragment>
            ))
          ) : (
            // New logic for multiple rows or single rows
            data.map((item, index) => {
              const itemId = (item as any)?.id || (item as any)?.name || index;
              const uniqueKey = `item-${itemId}-${index}`;
              
              if (useMultipleRows) {
                // Handle multiple rows per item
                const renderedRows = renderRow(item, false);
                const rowsArray = Array.isArray(renderedRows) ? renderedRows : [renderedRows];
                
                return (
                  <Fragment key={uniqueKey}>
                    {rowsArray.map((row, rowIndex) => (
                      <Fragment key={`${uniqueKey}-row-${rowIndex}`}>
                        {row}
                      </Fragment>
                    ))}
                  </Fragment>
                );
              } else {
                // Standard single row
                return (
                  <tr key={uniqueKey}>
                    {withActions && actionPosition === "start" && renderActions(item, index)}
                    {renderRow(item, false)}
                    {withActions && actionPosition === "end" && renderActions(item, index)}
                  </tr>
                );
              }
            })
          )}
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
