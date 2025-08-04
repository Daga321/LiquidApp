
import { IResultsHeaderDataProps } from "../../../Types/components/IResultsComponentsProps";
import "./ResultsHeaderData.css";

/**
 * Results Header Data Component
 * Renders the invoice header information and payment dates
 */
export function ResultsHeaderData({ invoice }: IResultsHeaderDataProps){

    /**
     * Calculates days remaining until due date and returns appropriate message
     * @param dueDate - The due date
     * @returns Urgency message based on days remaining
     */
    const getUrgencyMessage = (dueDate: Date | undefined): string => {
        if (!dueDate) return '';
        
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return 'PAGO VENCIDO';
        } else if (diffDays === 0) {
            return 'PAGO URGENTE - Hoy vence';
        } else if (diffDays <= 3) {
            return `PAGO URGENTE - ${diffDays} día${diffDays > 1 ? 's' : ''} restante${diffDays > 1 ? 's' : ''}`;
        } else {
            return `${diffDays} días hasta el vencimiento`;
        }
    };

    /**
     * Gets the appropriate unit/value label based on service type
     * @returns Formatted unit cost or value per person information
     */
    const getUnitValueInformation = (): string => {
        if (invoice.singleMeter) {
            return `Valor por persona: $${invoice.valuePerPeople.toFixed(2)}`;
        } else {
            return `Costo por ${invoice.unit}: $${invoice.unitCost.toFixed(2)}`;
        }
    };

    const currentDate = new Date();

    return (
        <>
            <h2 className="section-title">
                {invoice.serviceName} 
            </h2>

            <div className="form-group full-width no-padding">
                <table className="layout-table">
                    <tbody>
                        <tr>
                            <td className="label-cell">
                                <label>Fecha de liquidación:</label>
                                <br/> 
                                {currentDate.toLocaleDateString()}
                            </td>
                            <td className="value-cell" rowSpan={2}>
                                <label className="urgent-payment">
                                    {getUrgencyMessage(invoice.dueDate)}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td className="label-cell">
                                <label>Fecha límite de pago:</label>
                                <br/>
                                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'No disponible'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="form-group">
                <label>
                    {getUnitValueInformation()}
                </label>
            </div>
        </>
    );
}
