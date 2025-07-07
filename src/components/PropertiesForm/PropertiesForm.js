/**
 * PropertiesForm Component
 * Renders the form for properties input and table
 */
export function PropertiesForm() {
    return (
        <>
            <div className="form-group" id="property-name-group">
                <label htmlFor="property-name">Nombre del local/apartamento</label>
                <input type="text" id="property-name" placeholder="Ej: Local 1, Apto 101" />
            </div>

            <div className="form-group" id="liquidation-method-group">
                <label>Método de liquidación</label>
                <div id="liquidation-method" className="radio-group">
                    <label>
                        <input type="radio" name="method" id="percentage" /> 
                        Porcentaje
                    </label>
                    <label>
                        <input type="radio" name="method" id="number-of-people" /> 
                        Número de personas
                    </label>
                </div>
            </div>

            <div className="form-group">
                <button className="button" id="AddPropertyButton" onClick="manager.addProperty()">
                    Agregar
                </button>
            </div>

            <div className="table-wrapper">
                <table className="fixed-table" id="properties-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Valor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dinamicly generated Rows */}
                    </tbody>
                </table>
            </div>

            <div className="btn-actions">
                <button className="button" onClick="prevStep()">Atrás</button>
                <button className="button" id="PropertiesForm-NextButton" onClick="manager.setPropertiesFormValue()">
                    Siguiente
                </button>
            </div>
        </>
    );
}
