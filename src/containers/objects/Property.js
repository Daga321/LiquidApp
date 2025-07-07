class Property {

    constructor(name, method) {
        this.name = name;
        this.method = method;
        this.baseValue = 0;
        this.amountToPay = 0;
        this.adjustmentValue = 0;
        this.totalToPay = 0;
        this.adjustmentsList = [];
    }

    addAdjustment(adjustment) {
        this.adjustmentsList.push(adjustment);
    }

    removeAdjustment(adjustment) {
        this.adjustmentsList = this.adjustmentsList.filter(a => a !== adjustment);
    }

    liquidate(billValue, valuePerPeope, servicesAmount) {
        this.amountToPay = 0;
        this.totalToPay = 0;
        this.adjustmentValue = 0;

        switch (this.method) {
            case LiquidationMethodEnum.PERCENTAGE:
                this.amountToPay = billValue * this.baseValue / 100;
                break;
            case LiquidationMethodEnum.PEOPLE:
                this.amountToPay = valuePerPeope * this.baseValue;
                break;
            case LiquidationMethodEnum.CONSUMPTION:
                this.amountToPay = servicesAmount * this.baseValue;
                break;
        }
        
        for (const adjustment of this.adjustmentsList) {
            if (adjustment.type === AdjustmentTypeEnum.DISCOUNT) {
                this.adjustmentValue -= adjustment.value;
            } else if (adjustment.type === AdjustmentTypeEnum.EXTRA_CHARGE) {
                this.adjustmentValue += adjustment.value;
            }
        }

        this.totalToPay = this.amountToPay + this.adjustmentValue;
    }
    
}