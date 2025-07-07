class Manager {

    constructor() {
        this.serviceName =""
        this.properties = []
        this.billValue = 0
        this.valuePerPeope = 0
        this.servicesAmount = 0
    }

    setGeneralDataValue() {

        const select = document.getElementById("service-name-select")
        this.serviceName = select.options[select.selectedIndex].text
        if (this.serviceName === "Otro"){
            this.serviceName = document.getElementById("service-name-input").value.trim()
        }
        this.billValue = parseFloat(document.getElementById("invoice-value")?.value) || 0
        this.servicesAmount = parseFloat(document.getElementById("service-amount")?.value) || 0
        nextStep()
    }

    setPropertiesFormValue() {
        this.valuePerPeope = 0

        if (this.properties.length > 0 && this.properties[0].method.Key !== LiquidationMethodEnum.CONSUMPTION.Key) {
            let numberOfPeoples = 0
            let percentageAvailable = 100

            for (const property of this.properties) {
                switch (property.method.Key) {
                    case LiquidationMethodEnum.PEOPLE.Key:
                        numberOfPeoples += property.baseValue
                        break
                    case LiquidationMethodEnum.PERCENTAGE.Key:
                        percentageAvailable -= property.baseValue
                        break
                }
            }

            if (numberOfPeoples > 0) {
                this.valuePerPeope = (this.billValue * percentageAvailable/100) / numberOfPeoples
            }
        }
        nextStep()
        setPropertySelectData();
    }

    addProperty() {
        const nameInput = document.getElementById("property-name")
        const percentageRadioButton = document.getElementById("percentage")
        const peopleRadioButton = document.getElementById("number-of-people")

        const name = nameInput.value.trim()
        if (!name) return
        // Determinate input type
        const isMultipleMeter = document.getElementById("multiple-meter").checked
        let LiquidationType = {} // CONSUMPTION | PERCENTAGE | PEOPLE
        if (isMultipleMeter) {
            LiquidationType = LiquidationMethodEnum.CONSUMPTION
        } else {
            const percentage = percentageRadioButton.checked
            LiquidationType = percentage ? LiquidationMethodEnum.PERCENTAGE : LiquidationMethodEnum.PEOPLE
        }

        const property = new Property(name, LiquidationType)
        this.properties.push(property)

        nameInput.value = ""
        percentageRadioButton.checked = false
        peopleRadioButton.checked = false

        renderPropertiesTable()
        validateAddProperties()
        validatePropertiesForm()
    }


    addAdjustment() {
        const selectProperty = document.getElementById("property-select");
        const propertyValue = selectProperty.value;
    
        const nameInput = document.getElementById("adjustment-name");
        const amountInput = document.getElementById("adjustment-amount");
        const extraChargeradioButton = document.getElementById("extra_charge");
        const discountRadioButton = document.getElementById("discount");
    
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const adjustmentType = extraChargeradioButton.checked ? AdjustmentTypeEnum.EXTRA_CHARGE : AdjustmentTypeEnum.DISCOUNT;
    
        if (!name || isNaN(amount)) return;
    
        const newAdjustment = new Adjustment(name, amount, adjustmentType);
    
        if (propertyValue === "all") {
            manager.properties.forEach((property, i) => {
                if (!property.adjustmentsList) property.adjustmentsList = [];
                property.adjustmentsList.push(Object.assign({}, newAdjustment));
            });
            renderAdjustments(this.properties.length); 
        } else {
            const propertyIndex = parseInt(propertyValue, 10);
            const property = manager.properties[propertyIndex];
            if (!property) return;
    
            if (!property.adjustmentsList) property.adjustmentsList = [];
            property.adjustmentsList.push(newAdjustment);
            renderAdjustments(propertyIndex);
        }
    
        nameInput.value = "";
        amountInput.value = "";
        extraChargeradioButton.checked = false;
        discountRadioButton.checked = false;
    
        validateAddAdjustment();
    }
    
    
    liquidate() {
        for (const property of this.properties) {
            property.liquidate(this.billValue, this.valuePerPeope, this.servicesAmount)
        }
        loadResultSection()
        nextStep()
    }

    array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    };

    clearAll() {
        this.properties = []
    }

}

const manager = new Manager()