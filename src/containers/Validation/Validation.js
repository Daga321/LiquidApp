// ---------------------- DISABLE BUTTONS ----------------------
document.getElementById("GeneralData-NextButton").disabled = true
document.getElementById("PropertiesForm-NextButton").disabled = true
// ---------------------- COMMOND FUNCTIONS ----------------------

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Apply general input validations
  const generalDataFields = [
    'service-name-select',
    'service-name-input',
    'billing-period-start',
    'billing-period-end',
    'due-date',
    'invoice-value',
    'unit',
    'service-amount'
  ]

  generalDataFields.forEach(id => {
    const input = document.getElementById(id)
    if (input) {
      input.addEventListener('input', validateGeneralDataForm)
    }
  })

  // 🔹 Apply radio button validation (meter selection)
  const meterRadios = document.querySelectorAll('input[name="meter"]')
  meterRadios.forEach(radio => {
    radio.addEventListener('change', validateGeneralDataForm)
  })

  // 🔹 Apply property name and method validation
  const propertyNameInput = document.getElementById("property-name")
  if (propertyNameInput) {
    propertyNameInput.addEventListener('input', validateAddProperties)
  }

  const liquidationRadios = document.querySelectorAll('input[name="method"]')
  liquidationRadios.forEach(radio => {
    radio.addEventListener('change', validateAddProperties)
  })

  // 🔹 Apply validation to property table inputs
  const propertiesTable = document.getElementById("properties-table")
  if (propertiesTable) {
    propertiesTable.addEventListener('input', e => {
      if (e.target.name && e.target.name.startsWith("input-")) {
        validatePropertiesForm()
      }
    })
  }

  // 🔹 Apply adjustment name, amount, and type validation
  const adjustmentFormFields = [
    'adjustment-name',
    'adjustment-amount'
  ]

  adjustmentFormFields.forEach(id => {
    const input = document.getElementById(id)
    if (input) {
      input.addEventListener('input', validateAddAdjustment)
    }
  })

  const adjustmentRadios = document.querySelectorAll('input[name="adjustment-type"]');
  adjustmentRadios.forEach(radio => {
    radio.addEventListener('change', validateAddAdjustment);
  });


  // 🔹 Initial validations and date restriction
  generalDataDateRestriction()
  validateGeneralDataForm()
  validateAddProperties()
  validatePropertiesForm()
  validateAddAdjustment()
})


function setError(element, message) {
  let errorEl = element.parentElement.querySelector('.error-message')

  if (!errorEl) {
    errorEl = document.createElement('div')
    errorEl.className = 'error-message'
    element.parentElement.appendChild(errorEl)
  }

  errorEl.textContent = message
}

// ---------------------- GENERAL DATA ----------------------

function validateGeneralDataForm() {
  let isValid = true

  //validation logic
  const validateField = (id, message) => {
    const input = document.getElementById(id)
    const value = input.value.trim()
    let error = ""

    if (value === "") {
      error = message
      isValid = false
    }

    setError(input, error)
  }

  const validateNumber = (id, message) => {
    const input = document.getElementById(id)
    const value = parseFloat(input.value)
    let error = ""

    if (isNaN(value) || value < 1) {
      error = message
      isValid = false
    }

    setError(input, error)
  }

  const validateDateLogic = () => {
    const today = new Date().toISOString().split("T")[0]
    const start = document.getElementById("billing-period-start").value
    const end = document.getElementById("billing-period-end").value
    const due = document.getElementById("due-date").value

    if (start) {
      if (start > today) {
        setError(document.getElementById("billing-period-start"), "La fecha no puede ser posterior a hoy")
        isValid = false
      } else {
        setError(document.getElementById("billing-period-start"), "")
      }
    }

    if (end) {
      if (start && end <= start) {
        setError(document.getElementById("billing-period-end"), "Debe ser posterior al inicio del periodo")
        isValid = false
      } else if (end >= today) {
        setError(document.getElementById("billing-period-end"), "Debe ser anterior a hoy")
        isValid = false
      } else {
        setError(document.getElementById("billing-period-end"), "")
      }
    }

    if (due) {
      if (end && due <= end) {
        setError(document.getElementById("due-date"), "Debe ser posterior al fin del periodo")
        isValid = false
      } else {
        setError(document.getElementById("due-date"), "")
      }
    }
  }

  // Basic Validations
  const nameOption = document.getElementById("service-name-select").value
  if(nameOption === "Otro"){
    validateField("service-name-input", "Ingresa el nombre del servicio")
  }

  validateField("billing-period-start", "Ingresa el inicio del periodo")
  validateField("billing-period-end", "Ingresa el fin del periodo")
  validateField("due-date", "Selecciona la fecha límite de pago")

  const singleMeterElemets = document.getElementById("invoice-value-collection")
  if (!singleMeterElemets.classList.contains("fade-out") && !singleMeterElemets.classList.contains("hidden")) {
    validateNumber("invoice-value", "Debe ser un número mayor o igual a 1")
  }

  const multipleMeterElement = document.getElementById("collection-unit")
  if (!multipleMeterElement.classList.contains("fade-out") && !multipleMeterElement.classList.contains("hidden")) {
    validateField("unit", "Especifica la unidad de cobro")
    validateNumber("service-amount", "Debe ser un número mayor o igual a 1")
  }

  // Date logic validations
  validateDateLogic()

  document.getElementById("GeneralData-NextButton").disabled = !isValid
}

function generalDataDateRestriction() {
  const today = new Date()
  const yyyyMMdd = (date) => date.toISOString().split("T")[0]

  const billingStartInput = document.getElementById("billing-period-start")
  const billingEndInput = document.getElementById("billing-period-end")
  const dueDateInput = document.getElementById("due-date")

  // billing-period-start: today is the mas available date
  billingStartInput.max = yyyyMMdd(today)

  // billing-period-end: dinamic date range acording the start date
  billingStartInput.addEventListener("change", () => {
    const startDate = new Date(billingStartInput.value)
    if (billingStartInput.value) {
      const minEnd = new Date(startDate)
      minEnd.setDate(startDate.getDate() + 1)

      const maxEnd = new Date(today)
      maxEnd.setDate(today.getDate() - 1)

      billingEndInput.min = yyyyMMdd(minEnd)
      billingEndInput.max = yyyyMMdd(maxEnd)

      // Reset value if out of range
      if (billingEndInput.value && (billingEndInput.value < billingEndInput.min || billingEndInput.value > billingEndInput.max)) {
        billingEndInput.value = ""
      }

      // Reset due date
      dueDateInput.value = ""
      dueDateInput.min = ""
    }
  })

  // due-date: dinamic date range acording end date, it will be available after end date
  billingEndInput.addEventListener("change", () => {
    if (billingEndInput.value) {
      const endDate = new Date(billingEndInput.value)
      const minDue = new Date(endDate)
      minDue.setDate(endDate.getDate() + 1)
      dueDateInput.min = yyyyMMdd(minDue)

      if (dueDateInput.value && dueDateInput.value < dueDateInput.min) {
        dueDateInput.value = ""
      }
    }
  })
}

// ---------------------- PROPERTIES ----------------------
function validateAddProperties() {
  let isValid = true;

  // validation logic
  const validateInput = (id, message) => {
    const input = document.getElementById(id)
    const value = input.value.trim()
    let error = ""

    if (value === "") {
      error = message
      isValid = false
    }

    setError(input, error)
  }

  const validateLiquidationMethod = (id, message) => {
    const methodSelected = document.querySelector('input[name="method"]:checked');
    const methodGroup = document.getElementById(id);
    let error = "";

    if (!methodSelected) {
      error = message;
      isValid = false;
    }

    setError(methodGroup, error);
  };


  validateInput("property-name", "El nombre de la propiedad es requerido")

  const element = document.getElementById("liquidation-method-group")
  if (!element.classList.contains("fade-out") && !element.classList.contains("hidden")) {
    validateLiquidationMethod("liquidation-method", "Debe seleccionar un método de liquidación")
  }
  
  document.getElementById("AddPropertyButton").disabled = !isValid;
}

function validatePropertiesForm() {
  let isValid = true;
  let percentageTotal = 0;

  const inputElements = document.querySelectorAll('#properties-table input[name^="input-"]');
  isValid = inputElements.length > 0
  const isMultipleMeterChecked = document.getElementById("multiple-meter").checked;

  const percentageInputs = [];
  const peopleInputs = [];

  // Clasificate inputs using inputtype: PERCENTAGE || PEOPLE
  inputElements.forEach(input => {
    const row = input.closest("tr");
    const type = row?.dataset?.inputType;

    if (type === LiquidationMethodEnum.PERCENTAGE.Key) {
      percentageInputs.push(input);
    } else if (type === LiquidationMethodEnum.PEOPLE.Key) {
      peopleInputs.push(input);
    }
  });

  //validation logic
  const validateInput = (input, options = {}) => {
    const value = parseFloat(input.value);
    let errorMessage = "";

    if (isNaN(value)) {
      errorMessage = "El campo no puede estar vacío.";
      isValid = false;
    } else if (options.min !== undefined && value < options.min) {
      errorMessage = `Debe ser mayor o igual a ${options.min}.`;
      isValid = false;
    } else if (options.max !== undefined && value > options.max) {
      errorMessage = `Debe ser menor o igual a ${options.max}.`;
      isValid = false;
    }

    setError(input, errorMessage);
    return isNaN(value) ? 0 : value;
  };

  if (isMultipleMeterChecked) {
    inputElements.forEach(input => {
      validateInput(input, { min: 1 });
    });
  } else {
    //validate people method
    peopleInputs.forEach(input => {
      validateInput(input, { min: 1 });
    });

    //Validate percentage method
    percentageInputs.forEach(input => {
      const value = validateInput(input, { min: 1, max: 100 });
      percentageTotal += value;
    });

    //validate percenteage summation
    if (percentageInputs.length > 0) {
      if (peopleInputs.length === 0 && percentageTotal !== 100) {
        isValid = false;
        percentageInputs.forEach(input => {
          setError(input, "El total debe sumar exactamente 100% si no hay otro método.");
        });
      }

      if (peopleInputs.length > 0 && (percentageTotal <= 0 || percentageTotal >= 100)) {
        isValid = false;
        percentageInputs.forEach(input => {
          setError(input, "El porcentaje total debe ser mayor a 0% y menor a 100% si hay otros métodos.");
        });
      }
    }
  }

  document.getElementById("PropertiesForm-NextButton").disabled = !isValid
}

// ---------------------- PROPERTIES ----------------------

function validateAddAdjustment() {
  let isValid = true;

  const validateInput = (id, message) => {
    const input = document.getElementById(id);
    const value = input.value.trim();
    let error = "";

    if (value === "") {
      error = message;
      isValid = false;
    }

    setError(input, error);
  };

  const validateAdjustmentType = (id, message) => {
    const adjustmentSelected = document.querySelector('input[name="adjustment-type"]:checked');
    const adjustmentGroup = document.getElementById(id);
    let error = "";

    if (!adjustmentSelected) {
      error = message;
      isValid = false;
    }

    setError(adjustmentGroup, error);
  };

  validateInput("adjustment-name", "El concepto del ajuste es requerido");
  validateInput("adjustment-amount", "El valor del ajuste es requerido");
  validateAdjustmentType("adjustment-radiobuttons", "Debe seleccionar si es un cargo adicional o un descuento");

  document.getElementById("add-adjustment-btn").disabled = !isValid;
}