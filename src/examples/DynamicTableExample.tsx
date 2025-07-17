import { useState } from "react";
import { DynamicTable } from "../components/DinamicTable/DynamicTable";
import { ColumnDefinition, ActionType } from "../Types/Componets/DynamicTableTypes";

// Example data type
interface ExampleItem {
  id: number;
  name: string;
  value: number;
  category: string;
}

export function DynamicTableExample() {
  const [data, setData] = useState<ExampleItem[]>([
    { id: 1, name: "Item 1", value: 100, category: "A" },
    { id: 2, name: "Item 2", value: 200, category: "A" },
    { id: 3, name: "Item 3", value: 300, category: "B" },
    { id: 4, name: "Item 4", value: 400, category: "B" },
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
    </div>
  );
}
