import { useState } from "react";
import { DynamicTable } from "../components/DynamicTable/DynamicTable";
import { ColumnDefinition, ActionType } from "../../Types/components/DynamicTableTypes";

// Example data type
interface ExampleItem {
  id: number;
  name: string;
  value: number;
  category: string;
  details?: string[]; // For multiple rows example
}

export function DynamicTableExample() {
  const [data, setData] = useState<ExampleItem[]>([
    { id: 1, name: "Item 1", value: 100, category: "A" },
    { id: 2, name: "Item 2", value: 200, category: "A" },
    { id: 3, name: "Item 3", value: 300, category: "B" },
    { id: 4, name: "Item 4", value: 400, category: "B" },
  ]);

  const [multiRowData, setMultiRowData] = useState<ExampleItem[]>([
    { 
      id: 1, 
      name: "Producto A", 
      value: 150, 
      category: "Electronics",
      details: ["Descuento por volumen: -$20.00", "Cargo por envío: +$15.00"]
    },
    { 
      id: 2, 
      name: "Producto B", 
      value: 250, 
      category: "Books",
      details: ["Descuento estudiante: -$30.00"]
    },
    { 
      id: 3, 
      name: "Producto C", 
      value: 180, 
      category: "Electronics"
      // No details - should show only main row
    },
    { 
      id: 4, 
      name: "Producto D", 
      value: 320, 
      category: "Clothes",
      details: ["Cargo por importación: +$45.00", "Descuento fidelidad: -$25.00", "Seguro: +$12.50"]
    }
  ]);

  const columns: ColumnDefinition[] = [
    { key: "id", title: "ID", width: 80, align: "center" },
    { key: "name", title: "Nombre", width: "200px" },
    { key: "value", title: "Valor", width: 120, align: "right" },
    { key: "category", title: "Categoría", width: 100, align: "center" },
  ];

  const handleAction = (action: ActionType, item: ExampleItem) => {
    const currentIndex = data.findIndex(d => d.id === item.id);
    
    switch (action) {
      case "up":
        if (currentIndex > 0) {
          const newData = [...data];
          [newData[currentIndex], newData[currentIndex - 1]] = 
          [newData[currentIndex - 1], newData[currentIndex]];
          setData(newData);
        }
        break;
        
      case "down":
        if (currentIndex < data.length - 1) {
          const newData = [...data];
          [newData[currentIndex], newData[currentIndex + 1]] = 
          [newData[currentIndex + 1], newData[currentIndex]];
          setData(newData);
        }
        break;
        
      case "delete":
        setData(prev => prev.filter(d => d.id !== item.id));
        break;
        
      case "edit":
        console.log("Edit item:", item);
        break;
    }
  };

  const renderRow = (item: ExampleItem) => (
    <>
      <td style={{ textAlign: "center" }}>{item.id}</td>
      <td>{item.name}</td>
      <td style={{ textAlign: "right" }}>${item.value}</td>
      <td style={{ textAlign: "center" }}>{item.category}</td>
    </>
  );

  const renderGroupedRow = (item: ExampleItem, skipGroupColumn?: boolean) => (
    <>
      {!skipGroupColumn && (
        <td style={{ textAlign: "center" }}>{item.category}</td>
      )}
      <td style={{ textAlign: "center" }}>{item.id}</td>
      <td>{item.name}</td>
      <td style={{ textAlign: "right" }}>${item.value}</td>
    </>
  );

  // Render row function for multiple rows example
  const renderMultipleRows = (item: ExampleItem) => {
    const rows = [];
    
    // Main row
    const mainRow = (
      <tr key={`main-${item.id}`}>
        <td style={{ textAlign: "center" }}>{item.id}</td>
        <td>{item.name}</td>
        <td style={{ textAlign: "right" }}>${item.value}</td>
        <td style={{ textAlign: "center" }}>{item.category}</td>
      </tr>
    );
    
    rows.push(mainRow);
    
    // Details row (if any)
    if (item.details && item.details.length > 0) {
      const detailsRow = (
        <tr key={`details-${item.id}`} style={{ backgroundColor: "var(--gray-light)" }}>
          <td colSpan={4} style={{ padding: "8px 16px", borderTop: "1px solid var(--gray-medium)" }}>
            <div>
              {item.details.map((detail, index) => (
                <div key={index} style={{ 
                  fontSize: "0.9em",
                  marginBottom: index < item.details!.length - 1 ? "4px" : "0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span>{detail.split(':')[0]}:</span>
                  <span style={{ 
                    color: detail.includes('+') ? "var(--color-danger)" : "var(--color-success)",
                    fontWeight: "500"
                  }}>
                    {detail.split(':')[1]?.trim()}
                  </span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      );
      rows.push(detailsRow);
    }
    
    return rows;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dynamic Table Example</h1>
      
      <h2>Basic Table with Actions</h2>
      <DynamicTable
        data={data}
        columns={columns}
        renderRow={renderRow}
        withActions={true}
        onAction={handleAction}
        actionPosition="end"
      />
      
      <h2>Grouped Table by Category</h2>
      <DynamicTable
        data={data}
        columns={columns}
        renderRow={renderGroupedRow}
        withActions={true}
        onAction={handleAction}
        groupBy="category"
        actionPosition="end"
      />

      <h2>Multiple Rows Example</h2>
      <p style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
        Esta tabla demuestra la funcionalidad de múltiples filas. Cada producto puede tener detalles adicionales 
        que se muestran en una fila expandida debajo.
      </p>
      <DynamicTable
        data={multiRowData}
        columns={columns}
        renderRow={renderMultipleRows}
        withActions={false}
        allowMultipleRows={true}
      />
    </div>
  );
}
