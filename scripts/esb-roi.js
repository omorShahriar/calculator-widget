(function () {
  let fieldData = [];
  async function getBusTypes() {
    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:oex10dm_/esb-roi-bus-types"
      );
      const data = await response.json();
      const busTypeSelect =
        document.getElementById("busType");

      data.forEach((bus) => {
        const option =
          document.createElement("option");
        option.value = bus.bus_id;
        option.text = bus.bus_type;
        busTypeSelect.appendChild(option);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function attachResetEventListeners() {
    const inputs =
      document.querySelectorAll("input");
    const selects =
      document.querySelectorAll("select");

    function handleInputChange() {
      reset();
    }

    inputs.forEach((input) => {
      input.addEventListener(
        "input",
        handleInputChange
      );
    });

    selects.forEach((select) => {
      select.addEventListener(
        "input",
        handleInputChange
      );
    });
  }

  function openTab(evt, taskName) {
    var i, tabcontent, tablinks;

    tabcontent =
      document.getElementsByClassName(
        "tabcontent"
      );
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks =
      document.getElementsByClassName("tablinks");
    var tabcontents =
      document.getElementsByClassName(
        "tabcontent"
      );
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[
        i
      ].className.replace(" active", "");
      tabcontents[i].className = tabcontents[
        i
      ].className.replace(" active", "");
    }

    document.getElementById(
      taskName
    ).style.display = "flex";
    document.getElementById(taskName).className +=
      " active";
    evt.currentTarget.className += " active";
  }

  function objectToQueryString(obj) {
    const keys = Object.keys(obj);
    const keyValuePairs = keys.map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    });
    return keyValuePairs.join('&');
  }
  function limitFloatPrecision(value, precision = 2) {
    if (Number(value) === value && value % 1 !== 0) {
      return parseFloat(value.toFixed(precision));
    }
    return value;
  }
  window.calculateVoucher =
    async function calculateVoucher() {
      const dieselgas_mpg =
        document.getElementById("dieselgas_mpg").value;

      const dieselgas_cost = document.getElementById(
        "dieselgas_cost"
      ).value;
      const annual_miles =
        document.getElementById(
          "annual_miles"
        ).value;
      const maintenance_cost_mi =
        document.getElementById(
          "maintenance_cost_mi"
        ).value;
      const purchase_price =
        document.getElementById(
          "purchase_price"
        ).value;
      const grants =
        document.getElementById(
          "grants"
        ).value;
      const electricity_cost =
        document.getElementById(
          "electricity_cost"
        ).value;

      const remaining_vehicle_life =
        document.getElementById(
          "remaining_vehicle_life"
        ).value;

      const efficiency =
        document.getElementById(
          "efficiency"
        ).value;

      const maintenance_reduction =
        document.getElementById(
          "maintenance_reduction"
        ).value;

      const battery_cost = document.getElementById(
        "battery_cost"
      ).value;
      // show error if any of the fields are empty
      if (
        !dieselgas_mpg ||
        !dieselgas_cost ||
        !annual_miles ||
        !maintenance_cost_mi ||
        !purchase_price ||
        !grants ||
        !electricity_cost ||
        !remaining_vehicle_life ||
        !efficiency ||
        !maintenance_reduction ||
        !battery_cost
      ) {
        alert(
          "Please fill out all fields"
        );
        return;
      }

      // show error if purchase price is not a number
      if (
        isNaN(dieselgas_mpg) ||
        isNaN(dieselgas_cost) ||
        isNaN(annual_miles) ||
        isNaN(maintenance_cost_mi) ||
        isNaN(purchase_price) ||
        isNaN(grants) ||
        isNaN(electricity_cost) ||
        isNaN(remaining_vehicle_life) ||
        isNaN(efficiency) ||
        isNaN(maintenance_reduction) ||
        isNaN(battery_cost)
      ) {
        alert(
          "Please enter a valid number for Diesel/Gas MPG"
        );
        return;
      }
      const button = document.getElementById(
        "busCalcButton"
      );
      button.innerText = "Calculating...";
      let data;
      try {
        const inputs_ice = {
          "dieselgas_mpg": dieselgas_mpg,
          "dieselgas_cost": dieselgas_cost,
          "annual_miles": annual_miles,
          "maintenance_cost_mi": maintenance_cost_mi
        }
        const inputs_repower = {
          "purchase_price": purchase_price,
          "grants": grants,
          "electricity_cost": electricity_cost,
          "remaining_vehicle_life": remaining_vehicle_life,
          "battery_cost": battery_cost,
          "efficiency": efficiency,
          "maintenance_reduction": maintenance_reduction
        }

        const link = `https://x8ki-letl-twmt.n7.xano.io/api:oex10dm_/esb-roi-calc`

        const response = await fetch(
          link, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            "inputs_ice": inputs_ice,
            "inputs_repower": inputs_repower
          })
        }
        );
        data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
        return;
      }
      document.getElementById(
        "dieselGasFuelCost"
      ).innerText = limitFloatPrecision(data.results_fuel.cost_dieselgas_annual);
      document.getElementById(
        "dieselGasFuelCostAnnual"
      ).innerText = limitFloatPrecision(data.results_fuel.cost_dieselgas_mi);
      document.getElementById(
        "electricFuelCost"
      ).innerText = limitFloatPrecision(data.results_fuel.cost_electric_mi);
      document.getElementById(
        "electricFuelCostAnnual"
      ).innerText = limitFloatPrecision(data.results_fuel.cost_electric_annual);
      document.getElementById(
        "savingFuelCost"
      ).innerText = limitFloatPrecision(data.results_fuel.savings_mi);
      document.getElementById(
        "savingFuelCostAnnual"
      ).innerText = limitFloatPrecision(data.results_fuel.savings_annual);
      document.getElementById(
        "savingFuelCostPercentage"
      ).innerText = limitFloatPrecision(data.results_fuel.savings_pct) + "%";

      document.getElementById("savingFuelCost").classList.add(data.results_fuel.savings_mi < 0 ? "negativeBg" : "positiveBg");
      document.getElementById("savingFuelCostAnnual").classList.add(data.results_fuel.savings_annual < 0 ? "negativeBg" : "positiveBg");
      document.getElementById("savingFuelCostPercentage").classList.add(data.results_fuel.savings_pct < 0 ? "negativeBg" : "positiveBg");



      document.getElementById(
        "dieselGasMaintenanceCost"
      ).innerText = limitFloatPrecision(data.results_maintenance.cost_dieselgas_mi);
      document.getElementById(
        "dieselGasMaintenanceCostAnnual"
      ).innerText = limitFloatPrecision(data.results_maintenance.cost_dieselgas_annual);
      document.getElementById(
        "electricMaintenanceCost"
      ).innerText = limitFloatPrecision(data.results_maintenance.cost_electric_mi);
      document.getElementById(
        "electricMaintenanceCostAnnual"
      ).innerText = limitFloatPrecision(data.results_maintenance.cost_electric_annual);
      document.getElementById(
        "savingMaintenanceCost"
      ).innerText = limitFloatPrecision(data.results_maintenance.savings_mi);
      document.getElementById(
        "savingMaintenanceCostAnnual"
      ).innerText = limitFloatPrecision(data.results_maintenance.savings_annual);
      document.getElementById(
        "savingMaintenanceCostPercentage"
      ).innerText = limitFloatPrecision(data.results_maintenance.savings_pct) + "%";

      document.getElementById("savingMaintenanceCost").classList.add(data.results_maintenance.savings_mi < 0 ? "negativeBg" : "positiveBg");
      document.getElementById("savingMaintenanceCostAnnual").classList.add(data.results_maintenance.savings_annual < 0 ? "negativeBg" : "positiveBg");
      document.getElementById("savingMaintenanceCostPercentage").classList.add(data.results_maintenance.savings_pct < 0 ? "negativeBg" : "positiveBg");



      document.getElementById(
        "repower_cost"
      ).innerText = limitFloatPrecision(data.results_summary.repower_cost);
      document.getElementById(
        "savings_annual"
      ).innerText = limitFloatPrecision(data.results_summary.savings_annual);
      document.getElementById(
        "savings_life"
      ).innerText = limitFloatPrecision(data.results_summary.savings_life);
      document.getElementById(
        "time_breakeven"
      ).innerText = limitFloatPrecision(data.results_summary.time_breakeven);
      document.getElementById("time_breakeven").classList.add(!data.results_summary.time_breakeven_positive ? "negativeBg" : "positiveBg");
      button.innerText = "Calculate";
    };

  window.reset = async function reset() {
    const vouchers =
      document.getElementsByClassName("voucher");
    for (
      let i = 0;
      i < Object.keys(vouchers).length;
      i++
    ) {
      const key = String(i);
      const value = vouchers[key];

      value.innerText = "0";
    }
  };

  async function initializeWidget() {
    try {
      const res = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:oex10dm_/esb-roi-labelsandhelp")
      fieldData = await res.json();
    } catch (e) {
      console.log(e);
      alert("Error fetching data. Please check console for more info.")
      return;
    }
    await generateBusCalculator(fieldData);
    const busVoucherButton =
      document.getElementById("busVoucherButton");
    busVoucherButton.classList.add("active");
    attachResetEventListeners();
  }

  async function generateBusCalculator(data) {

    const createInputElement = (
      labelText,
      inputId,
      inputType,
      tooltipText,
      options = []
    ) => {
      const label =
        document.createElement("label");
      label.textContent = labelText;

      const input = document.createElement(
        inputType === "select"
          ? "select"
          : "input"
      );
      input.id = inputId;

      if (inputType === "select") {
        options.forEach((option) => {
          const optionElement =
            document.createElement("option");
          optionElement.value = option.value;
          optionElement.text = option.text;
          input.appendChild(optionElement);
        });
      }
      const tooltip =
        document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.innerHTML = `
      <span>?</span>
      <span class="tooltiptext">${tooltipText}</span>
      `;

      const container =
        document.createElement("div");
      const inner = document.createElement("div");
      container.appendChild(label);
      inner.appendChild(input);
      inner.appendChild(tooltip);
      container.appendChild(inner);
      return container;
    };

    const createInputSection = (
      id,
      legendText,
      inputElements,
      buttonid
    ) => {
      const fieldset =
        document.createElement("fieldset");
      fieldset.id = id;

      const legend =
        document.createElement("legend");
      legend.textContent = legendText;

      fieldset.appendChild(legend);


      const splitArray = (inputElements) => {
        const firstArray = inputElements.slice(
          0,
          4
        );
        const secondArray = inputElements.slice(
          4,
          inputElements.length
        );
        return [firstArray, secondArray];
      }
      const [existingICEInputs, electricRepowerInputs] = splitArray(inputElements);
      const existingICEInputsHeading = document.createElement("p");
      existingICEInputsHeading.className = "inputsHeading";
      existingICEInputsHeading.innerText = `Existing ICE Bus`;

      fieldset.appendChild(existingICEInputsHeading);
      existingICEInputs.forEach((element) => {
        fieldset.appendChild(element);
      });

      const electricRepowerInputsHeading = document.createElement("p");
      electricRepowerInputsHeading.className = "inputsHeading";
      electricRepowerInputsHeading.innerText = `Electric Repower Costs`;

      fieldset.appendChild(electricRepowerInputsHeading);
      electricRepowerInputs.forEach((element) => {
        fieldset.appendChild(element);
      });
      return fieldset;
    };

    const createSummarySection = (
      id,
      legendText,
      summaryContent
    ) => {
      const fieldset =
        document.createElement("fieldset");
      fieldset.id = `${id}`;

      const legend =
        document.createElement("legend");
      legend.textContent = legendText;

      const calculationsDiv =
        document.createElement("div");
      calculationsDiv.id = "calculations";
      calculationsDiv.innerHTML = summaryContent;

      fieldset.appendChild(legend);
      fieldset.appendChild(calculationsDiv);

      return fieldset;
    };

    const createHelpNotesSection = (id) => {
      const notesDiv =
        document.createElement("div");
      notesDiv.id = `${id}`;
      if (id === "busNotes") {
        notesDiv.innerHTML = `
         <div>
               <em><strong>Disclaimer:</strong>This Calculator is For illustrative purposes only and accuracy is not guaranteed. The figures shown can vary based on your individual situation. NYSBIP rules are always subject to change and this calculator may not reflect that. Please consult an expert before depending on these results</em>
                 </div>
          `;
      }

      return notesDiv;
    };

    const createFooter = () => {
      const footer =
        document.createElement("footer");
      footer.id = `footer`;
      footer.innerHTML = `
          <em>Provided by <a href="http://www.spectivate.com" target="_blank">Spectivate LLC</a></em>
        `;

      return footer;
    };

    const busVoucherInputs = data.filter(d => d.field_type === "input").map(d => {
      return createInputElement(d.label, d.field_id, "number", d.help_text)
    });



    const busVoucherSection = createInputSection(
      "inputs",
      "INPUTS",
      busVoucherInputs,
      "busCalcButton"
    );
    const busCalcButton = `<button id="busCalcButton" onclick="calculateVoucher()">Calculate</button>`;
    busVoucherSection.innerHTML += busCalcButton;
    const inputs =
      document.getElementsByTagName("input");

    const finalSummary = document.createElement("div");
    finalSummary.id = "finalSummary";
    fieldData.filter(d => d.field_type === "result").map(
      d => {
        const container =
          document.createElement("div");
        container.className = "summary";
        const label = document.createElement("p");
        label.textContent = d.label;
        const wrapperDiv = document.createElement("div");
        const dollar = document.createElement("span");
        dollar.textContent = "$";
        const voucher = document.createElement("span");
        voucher.className = "voucher voucherBus";
        voucher.id = d.field_id;
        voucher.textContent = "-";

        const tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        tooltip.innerHTML = `
        <span>?</span>
        <span class="tooltiptext">${d.help_text}</span>
      `;

        const innerContainer = document.createElement("div");
        innerContainer.appendChild(dollar);
        innerContainer.appendChild(voucher);
        wrapperDiv.appendChild(innerContainer);

        wrapperDiv.appendChild(tooltip);
        container.appendChild(label);
        container.appendChild(wrapperDiv);
        return container;


      }).forEach(d => finalSummary.appendChild(d));

    const busVoucherSummarySection =
      createSummarySection(
        "summary",
        "RESULTS",
        `
        <table class="summaryTable">
          <thead>
            <tr>
              <th >Fueling Cost</th>
              <th>Per mi</th>
              <th>Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td >Diesel/Gas</td>
              <td>
                <span>$</span>
                <span class="voucher voucherBus" id="dieselGasFuelCost">-</span>
              </td>
              <td>
                <span>$</span>
                <span class="voucher voucherBus" id="dieselGasFuelCostAnnual">-</span>
              </td>
            </tr>
            <tr>
              <td >Electric</td>
              <td>
                <span>$</span>
                <span class="voucher voucherBus" id="electricFuelCost">-</span>
              </td>
              <td>
                <span>$</span>
                <span class="voucher voucherBus" id="electricFuelCostAnnual">-</span>
              </td>
            </tr>
            <tr class="savingsRow">
              <td >Savings</td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="savingFuelCost">-</span>
              </td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="savingFuelCostAnnual">-</span>
              </td>
              <td>
                <span class="voucher voucherBus" id="savingFuelCostPercentage">-</span>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="summaryTable">
          <thead>
            <tr>
              <th>Maintenance Cost</th>
              <th>Per mi</th>
              <th>Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Diesel/Gas</td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="dieselGasMaintenanceCost">-</span>
              </td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="dieselGasMaintenanceCostAnnual"
                  >-</span
                >
              </td>
            </tr>
            <tr>
              <td>Electric</td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="electricMaintenanceCost">-</span>
              </td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="electricMaintenanceCostAnnual"
                  >-</span
                >
              </td>
            </tr>
            <tr class="savingsRow">
              <td>Savings</td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="savingMaintenanceCost">-</span>
              </td>
              <td>
                <span>$</span
                ><span class="voucher voucherBus" id="savingMaintenanceCostAnnual"
                  >-</span
                >
              </td>
              <td>
                <span class="voucher voucherBus" id="savingMaintenanceCostPercentage"
                  >-</span
                >
              </td>
            </tr>
          </tbody>
        </table>

     <h2 id="final-summary">FINANCIAL SUMMARY</h2>
      ${finalSummary.outerHTML}
      


        `
      );
    const busVoucherNotesSection =
      createHelpNotesSection("busNotes");

    const footer = createFooter();
    const busCalculator = document.getElementById(
      "busCalculator"
    );
    busCalculator.innerHTML = `
      <div class='header' >
          <h1 id="heading">ESB REPOWER ROI CALCULATOR</h1>
          <div class="tab">
          <button class="tablinks" id="busVoucherButton">Calculator</button>
          </div>
      </div>
        <div id="singleBusVoucher" class="tabcontent active">
          ${busVoucherSection.outerHTML}
          ${busVoucherSummarySection.outerHTML}
          ${busVoucherNotesSection.outerHTML}
          ${footer.outerHTML}
        </div>
      `;
    const busTabButton = document.getElementById(
      "busVoucherButton"
    );
    busTabButton.onclick = (event) =>
      openTab(event, "singleBusVoucher");

    const styles = `
      *{
          margin:0;
          padding:0;
          box-sizing:border-box;

      }
      
      #busCalculator{
        max-width: ${styleConfig.containerMaxSize};
        margin:0 auto;
        padding: 1em;
        font-family: ${styleConfig.fontFamily};
        font-size:${styleConfig.fontSize};
      }
      #busCalculator p,
      #busCalculator hr,
      #busCalculator h2 {
        margin:0;
      }
      .hidden {
          display: none;
      }

      #heading {
        font-size: 3em;
        text-align: center;
        margin-bottom: 1.6em;
        padding: 1em;
        background: ${styleConfig.primaryColor};
        color:white;
      }
      .tab{
        display:flex;
        gap:.5em;
        position:relative;
        top:2px;
        z-index:10;
      }
      .tab .tablinks{
        max-width:fit-content;
        font-size: 1.2em;
        border:2px solid ${styleConfig.primaryColor};
        color:black;
        background:transparent;
        border-radius:1.2em;
        border-bottom:0;
        border-bottom-left-radius:0;
        border-bottom-right-radius:0;
        padding:1rem;
      }
      .tablinks.active{
        border-bottom-left-radius:0px;
        border-bottom-right-radius:0px;
        background-color:${styleConfig.bgColor};
        border-bottom:4px solid ${styleConfig.bgColor};
        color: ${styleConfig.primaryColor};
      }
      
      .tabcontent {
        display:none;
        flex-direction: column;
        gap:1rem;
        padding:1.6em;
        background-color: ${styleConfig.bgColor};
        border: 2px solid ${styleConfig.primaryColor};
        border-radius:1.2em;
        border-top-left-radius:0;
      }
      .tabcontent.active {
        display:flex;
        flex-direction: column;
      }
      
      #busCalculator fieldset {
        border: 2px solid ${styleConfig.primaryColor};
        border-radius: 1.2em;
        padding: 1em;
        display:flex;
        flex-direction:column;
        gap:.5rem;
        font-size:1.6em;
      }
      #busCalculator legend {
        font-size: 1.2em;
        font-weight: medium;
        color: ${styleConfig.primaryColor};
        padding:0 0.8em;
        margin:0 auto;
        max-width:fit-content;
        border-color:transparent;
      }
      #busCalculator hr{
        border:1px solid ${styleConfig.primaryColor};
      }
      #busCalculator input,
      #busCalculator select {
        border: 1px solid ${styleConfig.primaryColor};
        border-radius: .8em;
        padding: 0.5em;
        background:white;
      }
      #inputs div,
      #inputsFleet div {
        display:flex;
        justify-content:space-between;
        align-items:center;
      }
       #inputs div>div{
        display:flex;
        gap:0.5em;
        align-items:center;

       }
      #inputs button,
      #inputsFleet button{
        max-width:fit-content;
        margin:0 auto;
        padding:0.5em;
        border:1px solid transparent;
        background: ${styleConfig.primaryColor};
        color:white;
        border-radius:1.2em;
        font-size:1.2em;
        
      }
      #calculations {
        display:flex;
        flex-direction:column;
        gap:0.4em;
      }
      #calculations>div{
        display:flex;
        justify-content:space-between;
        align-items:center;
      }
      #final-summary{
        font-size:1.2em;
        font-weight: medium;
        margin-top:2em;
        color: ${styleConfig.primaryColor};
      }
      .summary{
        font-weight: bold;
      }
      #busNotes,
      #fleetNotes {
        font-size:1.2em;
        padding:2em;
        display:flex;
        flex-direction:column;
        gap:2rem;
      }
       #busNotes>div h3,
       #fleetNotes>div h3 {
        margin-bottom:1.6em;
       }
       #busNotes>div ol,
       #fleetNotes>div ol {
        padding-left:2em;
       }
      #footer {
        padding:1em;
        text-align:center;
        background-color:${styleConfig.primaryColor};
        width:100%;
        color:white;

      }
      #footer a{
        text-decoration:underline;
        color:white;
      }




      tr:nth-of-type(even) {
        background: #efefef;
      }
      



     .scrollable-table {
       width:100%;
        display: block;
        empty-cells: show;
        /* Decoration */
      
      
     }
     #eligibleBuses {
      justify-content: center;

      
     }
    .scrollable-table thead {
        background-color: #f1f1f1;  
        position:relative;
        display: block;
        width:100%;


    }

.scrollable-table tbody{
  /* Position */
  display: block; position:relative;
  width:100%; overflow-y:scroll;
  /* Decoration */
  border-top: 2px solid ${styleConfig.primaryColor};
}
     
.scrollable-table tr{
  width: 100%;
  border:0;
  display:flex;
}

.scrollable-table td,.scrollable-table th{
  flex-basis:100%;
  flex-grow:2;
  display: block;
  padding: 0.5rem;
  text-align:left;
  border:0;
}
.scrollable-table td:nth-child(1) ,.scrollable-table th:nth-child(1),
.scrollable-table td:nth-child(2) ,.scrollable-table th:nth-child(2),
.scrollable-table td:nth-child(5) ,.scrollable-table th:nth-child(5),
.scrollable-table td:last-child ,.scrollable-table th:last-child{
  flex-basis:60%;
}

#calculations #finalSummary{
  display:block;

}
#finalSummary .summary {
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.summary>div {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:6px;
}
#eligibleBuses .scrollable-table thead tr th {
  border-block-start:0;
  border:0;
} 
#eligibleBusesTableBody {
   max-height: 53.5vh;
}
      .modalOpener {
        color: #023e8a;
        cursor: pointer;
        font-weight: bold;
        text-decoration: underline;
      }

      #closeModalButton {
        color: #DE3C4B;
        font-size: 12px;
        background: white;
        border: transparent;
        font-weight: medium;
        padding:4px;
        border-radius: 50%;
      }

      .modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 9999; /* Sit on top */
        padding-top: 50px; /* Location of the box */
        inset:0;
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
      }
      .modal-content {
        position: relative;
        margin: 0 auto;
        padding: 0;
        width: 90%;
        background-color: white;
      }
      
      .modal-header {
        padding: 8px 16px;
        background-color: ${styleConfig.primaryColor} !important;
        color: white;
        display:flex;
        justify-content:space-between;
        align-items:center;
      }
        .modal-header h2 {
          font-size:1.6em;
          color:white;
        }
      
      .modal-body {
        padding: 2px 16px;
        overflow: auto;
      }
       .modal-table{
        width:100%;
        border-collapse: collapse;
        border-spacing: 0;
        border: 1px solid #ddd;
        margin:0 auto;
        font-size:1.2em;
       }
    
      .modal-footer {
        padding: 8px 16px;
        background-color: ${styleConfig.primaryColor} !important;
        color: white;
      }
      #busModal .modal-body .modal-table tr{
        display:flex;
      }
      #busModal .modal-body .modal-table td,
      #busModal .modal-body .modal-table th{
        flex-basis:50%;
        padding:0.5em;
      }
       #busModal .modal-body .modal-table th{
        background-color: transparent;
        text-align:right;
       }
      #busModal .modal-body .modal-table tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      #busModal .modal-footer h3 {
        color:white;
        font-size:1.2em;
        font-weight:bold;
      }

       /* Tooltip container */
      .tooltip {
        position: relative;
        max-width:fit-content;
        
        border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
      }

      /* Tooltip text */
      .tooltip .tooltiptext {
        visibility: hidden;
        min-width: 350px;
        max-width: fit-content;
        background-color: #555;
        color: #fff;
        text-align: center;
        padding: 4px ;
        border-radius: 6px;

        /* Position the tooltip text */
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -175px;

        /* Fade in tooltip */
        opacity: 0;
        transition: opacity 0.3s;
      }



      /* Show the tooltip text when you mouse over the tooltip container */
      .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
      } 
      

      .inputsHeading{
        font-size:1.4em;
        font-weight:bold;
        color:${styleConfig.primaryColor};
        padding:10px 0;
      }
      /* summary table style esb roi */
      .summaryTable {
        border:none;
        margin:12px 0;
      }
      .summaryTable thead th{
        border-bottom: 2px solid ${styleConfig.primaryColor};
      }
      .summaryTable td {
        padding:4px;
      } 
      
      .summaryTable .savingsRow {
        font-weight:bold;
      }

      .positiveBg {
        background-color: #d4edda;
      }
      .negativeBg {
        background-color: #f8d7da;
      }



      @media screen and (min-width: 768px) {
        .tab .tablinks{
          font-size: 2em;
        }
        .tabcontent.active {
          flex-direction: row;
          flex-wrap:wrap;
          padding:2em;
        }
        #inputs,#summary,
        #inputsFleet,#summaryFleet {
          flex-basis:45%;
          flex:1;
        }
        .tabcontent.active #busFooter,
        .tabcontent.active #fleetFooter {
          width:100%;
        }
        .modal {
          
          padding-top: 100px; /* Location of the box */
      }
        .modal-content {
          width: 50%;
        }
      }

      @media print {
        #busCalculator {
          display: none;
        }
      }
      `;
    const styleElement =
      document.createElement("style");

    if (styleElement.styleSheet) {
      // IE
      styleElement.styleSheet.cssText = styles;
    } else {
      // Other browsers
      styleElement.appendChild(
        document.createTextNode(styles)
      );
    }

    document.head.appendChild(styleElement);
  }


  window.onload = initializeWidget;
})();



