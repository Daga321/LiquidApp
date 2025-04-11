function toggleServiceInput(){
    const nameSelect = document.getElementById("service-name-select")
    const nameInputContainer = document.getElementById("collection-service-name")
    if(nameSelect.value === "Otro"){
        show(nameInputContainer)
  }else{
    if(!nameInputContainer.classList.contains("hidden")){
        hide(nameInputContainer)
    }
  }
}

function toggleMeterInputs() {
    const multipleMeter = document.getElementById("multiple-meter").checked;

    var displayinMultipleMeter =[]
    displayinMultipleMeter.push(document.getElementById("collection-unit"))
    displayinMultipleMeter.push(document.getElementById("unit-cost"))
    var displayinSingleMeter =[]
    displayinSingleMeter.push(document.getElementById("invoice-value-collection"))
    displayinSingleMeter.push(document.getElementById("liquidation-method-group"))

    displayinMultipleMeter.forEach(element => {
        multipleMeter ? show(element) : hide(element)
    });

    
    displayinSingleMeter.forEach(element => {
        !multipleMeter ? show(element) : hide(element)
    });
}

function show (element){
    element.classList.add("fade-in")
    element.classList.remove("hidden")
}

function hide(element) {
    element.classList.remove("fade-in");
    element.classList.add("fade-out");

    // whait until finish the animation to aply display: none in hide class
    setTimeout(() => {
        element.classList.add("hidden");
        element.classList.remove("fade-out");
    }, 200); 
}