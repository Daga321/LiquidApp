/**
 * DinamicTable Component
 * Renders a dynamic table with animations and special features
 */
export function DinamicTable({ headers = [], rows = [], tableId = 'dynamic-table' }) {
    return (
        <div className="table-wrapper">
            <table className="fixed-table dynamic-table" id={tableId}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr className="empty-row">
                            <td colSpan={headers.length}>No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Update table data dynamically
 */
export function updateTableData(tableId, newData) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (newData.length > 0) {
        newData.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } else {
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-row';
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = table.querySelector('thead tr').children.length;
        emptyCell.textContent = 'No hay datos disponibles';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
    }
}
