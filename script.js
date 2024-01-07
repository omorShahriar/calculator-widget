(function () {

    async function getBusTypes() {
      try {    
        const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/bus-types');
        const data = await response.json();
        const busTypeSelect = document.getElementById('busType');

        data.forEach(bus => {
            const option = document.createElement('option');
            option.value = bus.bus_id;
            option.text = bus.bus_type;
            busTypeSelect.appendChild(option);
        });
      } catch (error) {
        console.log(error);
      }
    }

    function openTab(evt, taskName) {
        // Declare all variables
        var i, tabcontent, tablinks;
        
        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        
        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(taskName).style.display = "flex";
        evt.currentTarget.className += " active";
    }

    window.calculateVoucher = async function calculateVoucher() {      
        const busId = document.getElementById('busType').value;
        const priorityDistrict = document.getElementById('priorityDistrict').checked;
        const scrappage = document.getElementById('scrappingICE').checked;
        const v2g = document.getElementById('v2gFeature').checked;
        const wheelchair = document.getElementById('wheelchair').checked;
        const purchasePrice = document.getElementById('purchasePrice').value;
        
        const vouchers = document.getElementsByClassName('voucherBus');
        for (let i = 0; i < Object.keys(vouchers).length; i++) {
          const key = String(i); // Convert the number to a string, as object keys are always strings
          const value = vouchers[key];
          
          value.innerText = 'Calculating';
        }

        let data;
        try {
          const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/calc-voucher?bus_id=${busId}&priority-district=${priorityDistrict}&scrappage=${scrappage}&v2g=${v2g}&wheelchair=${wheelchair}&purchase_price=${purchasePrice}`);
          data = await response.json();
        } catch (error) {
          console.log(error);
        }
        // Update the summary fields
        document.getElementById('baseVoucher').innerText = data.voucher.base_voucher;
        document.getElementById('priorityDistrictBonus').innerText = data.voucher.prioritydistrict;
        document.getElementById('scrappageBonus').innerText =  data.voucher.scrappage;
        document.getElementById('v2gAddOn').innerText = data.voucher.v2g;
        document.getElementById('wheelchairAddOn').innerText = data.voucher.wheelchair;
        document.getElementById('totalVoucher').innerText = data.voucher.total;
        
        document.getElementById('finalPurchasePrice').innerText = data.summary.purchase_price;
        document.getElementById('actualVoucher').innerText = data.summary.total_voucher;
        document.getElementById('outOfPocket').innerText = data.summary.out_of_pocket;
        
    }

    window.calculateFleet = async function calculateFleet() {
        const priorityDistrictFleet = document.getElementById('priorityDistrictFleet').checked;
        const electrification = document.getElementById('electrification').checked;
        const fleetSize = document.getElementById('fleetSize').value; 

        const vouchers = document.getElementsByClassName('voucherFleet');
        for (let i = 0; i < Object.keys(vouchers).length; i++) {
          const key = String(i); // Convert the number to a string, as object keys are always strings
          const value = vouchers[key];
          
          value.innerText = 'Calculating';
       }
        

        let data;
        try {
          const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/calc-fleet-cap?fleet-size=${fleetSize}&priority-district=${priorityDistrictFleet}&electrification-plan=${electrification}`)
          
          data = await response.json();
        } catch (error) {
          console.log(error);        
        }
        document.getElementById('baseCap').innerText = data["base-cap"];
        document.getElementById('priorityDistrictBonusFleet').innerText = data["bonus-prioritydistrict"];
        document.getElementById('electrificationBonus').innerText =  data["bonus-electrification-plan"]
        document.getElementById('totalCap').innerText = data["voucher-cap"];
    }
      

    async function initializeWidget() {
        const isValidCustomer = true;
        if (isValidCustomer) {
            // If the customer is valid, fetch bus types
            generateBusCalculator();
            await getBusTypes();
        } else {
            alert('Invalid customer. Please contact support.');
        }
    }

    function generateBusCalculator() {
      const createInputElement = (labelText, inputId, inputType, options = []) => {
        const label = document.createElement('label');
        label.textContent = labelText;

      
        const input = document.createElement(inputType === 'select' ? 'select' : 'input');
        input.id = inputId;
      
        if (inputType === 'select') {
          options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.text = option.text;
            input.appendChild(optionElement);
          });
        }
      
        const container = document.createElement('div');
        container.appendChild(label);
        container.appendChild(input);
      
        return container;
      };
      
    
      const createCheckboxElement = (labelText, checkboxId) => {
        const label = document.createElement('label');
        label.textContent = labelText;
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
    
        const container = document.createElement('div');
        container.className = 'checkbox-container';
        container.appendChild(label);
        container.appendChild(checkbox);
    
        return container;
      };
    
      const createInputSection = (id, legendText, inputElements, buttonid) => {
        const fieldset = document.createElement('fieldset');
        fieldset.id = id;
    
        const legend = document.createElement('legend');
        legend.textContent = legendText;
    
        fieldset.appendChild(legend);
    
        inputElements.forEach((element) => {
          fieldset.appendChild(element);
        });
    
        return fieldset;
      };
    
      const createSummarySection = (id, legendText, summaryContent) => {
        const fieldset = document.createElement('fieldset');
        fieldset.id = `${id}`;
      
        const legend = document.createElement('legend');
        legend.textContent = legendText;
      
        const calculationsDiv = document.createElement('div');
        calculationsDiv.id = 'calculations';
        calculationsDiv.innerHTML = summaryContent;
      
        fieldset.appendChild(legend);
        fieldset.appendChild(calculationsDiv);
      
        return fieldset;
      };
      
    
      const createHelpNotesSection = (id) => {
        const notesDiv = document.createElement('div');
        notesDiv.id = `${id}`;
        if (id === 'busNotes') {
          notesDiv.innerHTML = `
          <h3>Help Notes:</h3>
               <ol>
                 <li>Choose either a new bus or a repower of your existing vehicle. Only the vehicle types shown are covered.</li>
                 <li>Enter the manufacturer's full purchase price, including all options and fees.</li>
                 <li>A bonus is available if your bus is operated in a Priority District. Priority Districts include SED-designated High Need/Resource Capacity districts and districts that serve Disadvantaged Communities (DACs). This bonus may also apply for school buses that are stored in an existing depot that is situated in a DAC.
                   <ul>
                     <li><a href="#">Click here</a> for a list of Priority Districts</li>
                     <li><a href="#">Click here</a> for a map of DACs (Disadvantaged Communities)</li>
                   </ul>
                 </li>
                 <li>If you scrap an eligible bus you can receive additional funds. Applies only to new buses and not repowers.</li>
                 <li>If your new bus (or repower) has the V2G (Vehicle to Grid) feature you are eligible for additional money.</li>
                 <li>If your new bus has a wheelchair, you are eligible for additional money. Repowers are not eligible</li>
               </ol>
               <em><strong>Disclaimer:</strong> This calculator is for illustrative purposes only and accuracy is not guaranteed. The figures shown can vary based
                 on your individual situation. NYSBIP rules are always subject to change and this calculator may not reflect that. Please
                 consult an expert before depending on these results.</em>
          `;
        } else if (id === 'fleetNotes') {
          notesDiv.innerHTML = `
          <h3>Help Notes:</h3>
               <ol>
                 <li>Enter your total fleet size (i.e. number of buses in your current fleet).</li>
                 <li>A bonus is available if your bus is operated in a Priority District. Priority Districts include SED-designated High Need/Resource Capacity districts and districts that serve Disadvantaged Communities (DACs). This bonus may also apply for school buses that are stored in an existing depot that is situated in a DAC.
                   <ul>
                     <li><a href="#">Click here</a> for a list of Priority Districts</li>
                     <li><a href="#">Click here</a> for a map of DACs (Disadvantaged Communities)</li>
                   </ul>
                 </li>
                 <li> Districts and Third Party Operators may apply for a greater number of vouchers within the first two (2) years of NYSBIP if they complete an approved Fleet Electrification Plan demonstrating Utility engagement for Charging Infrastructure design a timeline for receiving ESBs, and other requirements.</li>
               </ol>
               <em><strong>Disclaimer:</strong> This calculator is for illustrative purposes only and accuracy is not guaranteed. The figures shown can vary based
                 on your individual situation. NYSBIP rules are always subject to change and this calculator may not reflect that. Please
                 consult an expert before depending on these results.</em>
          `;
        }
    
        return notesDiv;
      };
    
      const createFooter = (id) => {
        const footer = document.createElement('footer');
        footer.id = `${id}Footer`;
        footer.innerHTML = `
          <em>Provided by <a href="#">Spectative LLC</a></em>
        `;
    
        return footer;
      };
    
      const busVoucherInputs = [
        createInputElement('Bus Type:', 'busType', 'select'),
        createInputElement('Bus Purchase Price:', 'purchasePrice', 'number'),
        createCheckboxElement('Operates in Priority District?', 'priorityDistrict'),
        createCheckboxElement('Scrapping an ICE bus?', 'scrappingICE'),
        createCheckboxElement('New bus includes V2G feature?', 'v2gFeature'),
        createCheckboxElement('New bus includes a wheelchair?', 'wheelchair'),
      ];
    
      const fleetCapsInputs = [
        createInputElement('Fleet Size:', 'fleetSize', 'number'),
        createCheckboxElement('Operates in Priority District?', 'priorityDistrictFleet'),
        createCheckboxElement('Have an approved fleet electrification plan?', 'electrification'),
      ];
    
      const busVoucherSection = createInputSection('inputs', 'INPUTS', busVoucherInputs, 'busCalcButton');
      const busCalcButton = `<button id="busCalcButton" onclick="calculateVoucher()">Calculate</button>`;
      busVoucherSection.innerHTML += busCalcButton;
      const busVoucherSummarySection = createSummarySection('summary', 'RESULTS', `
      
      <p>Base Voucher: </p><span>$</span><span class="voucher voucherBus" id="baseVoucher">-</span>
      <p>Priority District Bonus: </p><span>$</span><span class="voucher voucherBus" id="priorityDistrictBonus">-</span>
      <p>Scrappage Bonus: </p><span>$</span><span class="voucher voucherBus" id="scrappageBonus">-</span>
      <p>V2G Add-On: </p><span>$</span><span class="voucher voucherBus" id="v2gAddOn">-</span>
      <p>Wheelchair Add-On: </p><span>$</span><span class="voucher voucherBus" id="wheelchairAddOn">-</span>
      <hr>
      <p>Total Possible NYSBIP Voucher: </p><span>$</span><span class="voucher voucherBus" id="totalVoucher">-</span>
      <div id="final-summary">
        <h2>SUMMARY</h2>
        <p>Bus Purchase Price: </p><span>$</span><span class="voucher voucherBus" id="finalPurchasePrice">-</span>
        <p>Actual NYSPIB Voucher: </p><span>$</span><span class="voucher voucherBus" id="actualVoucher">-</span>
        <hr>
        <p>Your Out of Pocket: </p><span>$</span><span class="voucher voucherBus" id="outOfPocket">-</span>
        </div>
        `);
      const busVoucherNotesSection = createHelpNotesSection('busNotes');
      const busVoucherFooter = createFooter('bus');
    
      const fleetCapsSection = createInputSection('inputsFleet', 'INPUTS', fleetCapsInputs, "fleetCalcButton");
      const fleetCalcButton = `<button id="fleetCalcButton" onclick="calculateFleet()">Calculate</button>`;
      fleetCapsSection.innerHTML += fleetCalcButton;
      const fleetCapsSummarySection = createSummarySection('summaryFleet', 'RESULTS', `
      <p>Base Cap: </p><span>$</span><span class="voucher voucherFleet" id="baseCap">-</span>
      <p>Priority District Bonus: </p><span>$</span><span class="voucher voucherFleet" id="priorityDistrictBonusFleet">-</span>
      <p>Fleet Electrification Plan Bonus: </p><span>$</span><span class="voucher voucherFleet" id="electrificationBonus">-</span>
      <hr>
      <p>Total # of Bus Vouchers Eligible: </p><span>$</span><span class="voucher voucherFleet" id="totalCap">-</span>
      `);
      const fleetCapsNotesSection = createHelpNotesSection('fleetNotes');
      const fleetCapsFooter = createFooter('fleet');
    
      const busCalculator = document.getElementById('busCalculator');
      busCalculator.innerHTML = `
      <div class="tab">
      <div id="heading"><h1>NYSBIP CALCULATOR</h1></div>
          <button class="tablinks" id="busVoucherButton">Single Bus Voucher</button>
          <button class="tablinks" id="fleetwideButton">Fleetwide Caps</button>
        </div>
        <div id="singleBusVoucher" class="tabcontent active">
          ${busVoucherSection.outerHTML}
          ${busVoucherSummarySection.outerHTML}
          ${busVoucherNotesSection.outerHTML}
          ${busVoucherFooter.outerHTML}
        </div>
        <div id="fleetwideCaps" class="tabcontent">
          ${fleetCapsSection.outerHTML}
          ${fleetCapsSummarySection.outerHTML}
          ${fleetCapsNotesSection.outerHTML}
          ${fleetCapsFooter.outerHTML}
        </div>
      `;
      const busTabButton = document.getElementById('busVoucherButton');
      busTabButton.onclick = (event) => openTab(event, 'singleBusVoucher');
    
      const fleetTabButton = document.getElementById('fleetwideButton');
      fleetTabButton.onclick = (event) => openTab(event, 'fleetwideCaps');

 
      const styles = `
      .hidden {
          display: none;
      }
      #busCalculator {

      }
      #fleetwideCaps {
        position: absolute;
      }

      fieldset {
        border: 1px solid #${borderColor2};
      }

      legend {
          margin: 0 auto; 
          padding: 5px; 
      }

      #inputs,
      #summary {
        margin: 0 auto;
        width: 38vh;
        height: 45vh;
        margin-bottom: 20px;
        margin-top: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      #inputsFleet,
      #summaryFleet {
        margin: 0 auto;
        width: 38vh;
        height: 25vh;
        margin-bottom: 20px;
        margin-top: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      #inputsFleet {
        font-family: ${fontFamily},'Arial', sans-serif;
        background-color: #${backGroundColor};
      }

      #summary {
        font-family: ${fontFamily},'Arial', sans-serif;
        background-color: #${backGroundColor};
      }

      #inputs {
        font-family: ${fontFamily},'Arial', sans-serif;
        background-color: #${backGroundColor};
      }
      
      #summaryFleet {
        font-family: ${fontFamily},'Arial', sans-serif;
        background-color: #${backGroundColor};
      }
      
      
      label {
          display: inline-block;
          margin-bottom: 5px;
      }
      
      select, input, button {
          margin-bottom: 15px;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
      }
      
      input[type="checkbox"] {
        display: inline-block;
        width: 20px;
        position: relative;
        right: -20px;
        align-self: center;
      
      }
      
      button {
          background-color: #${buttonColor};
          font-family: ${fontFamily},'Arial', sans-serif;
          font-size: 1em;
          color: #fff;
          border: none;
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
      }
      
      button:hover {
          background-color: #${buttonHoverColor};
      }

      #heading {
        border: 1px solid #${borderColor1};
        width: 100%;
        background-color: #${headingBackgroundColor};
      }

      #heading h1 {
        margin: 0 auto;
        text-align: center;
        color: #fff;
        font-family: ${fontFamily},'Arial', sans-serif;
      }

      h2 {
          position: relative;
          padding: 0;
          margin-top: 10px;
          font-weight: 300;
          font-size: 18px;
          color: #080808;
          text-align: center;
          text-transform: uppercase;
          padding-bottom: 5px;
      }

      h3 {
        font-size: 1em;
        font-family: ${fontFamily},'Arial', sans-serif;
      }
      
      h2::before {
          width: 28px;
          height: 5px;
          display: block;
          content: "";
          position: absolute;
          bottom: 3px;
          left: 50%;
          margin-left: -14px;
          background-color: #b80000;
      }
      
      h2::after {
          width: 100px;
          height: 1px;
          display: block;
          content: "";
          position: relative;
          margin-top: 15px;
          left: 50%;
          margin-left: -50px;
          background-color: #b80000;
      }
      
      p {
          margin: 10px 0;
          display: inline-block;
          width: 27vh;
      }
      
      span {
          font-weight: bold;
          text-align: right;
      }
      
      label {
         margin-right: 10px; 
         width: 30vh;
      }
      
      #check-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: start;
          margin-bottom: 10px;
          margin-top: 10px;
      }
      
      .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
      }
      
      .voucher {
          display: inline-block;
          width: 20%;
          text-align: right;
          margin-left: 5px;
      }
      
      #summary p {
          margin-bottom: 1px;
      }

      #busNotes,
      #fleetNotes {
        font-family: ${fontFamily},'Arial', sans-serif;
        background-color: #${backGroundColor};
        font-size: 0.8em;
      }
      
      #calculations {
          margin-bottom: 20px;
      }

      .tab {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        background-color: #f1f1f1;
        width: 92.8vh;
      }
      
      .tab button {
        background-color: #${backGroundColorTab1};
        font-family: ${fontFamily},'Arial', sans-serif;
        font-size: 1em;
        color: #000;
        float: left;
        padding: 12px 14px;
        transition: 0.3s;
        border: 1px solid #${borderColor1};
        border-radius: 0;
        margin-bottom: 0;
        width: 50%;
      }
      
      .tab button:hover {
        background-color: #${backGroundColorTab2};
      }
      
      .tab button.active {
        background-color: #${backGroundColor};
        border-bottom: 0px;
      }
      
      .tabcontent {
        display: none;
        padding: 6px 12px;
        border: 1px solid #${borderColor1};
        border-top: 0px;
        border-radius: 0px 0px 10px 10px;
        width: 90vh;
        height: 82vh;
        flex-wrap: wrap;
        background-color: #${backGroundColor};
      }

      #singleBusVoucher {
        display: flex;
      }

      #fleetFooter,
      #busFooter {
        margin: 0 auto;
        margin-top: 5px;
        font-size: 0.8em;
        font-family: 'Arial', sans-serif;
        background-color: #f5f5f5;
        display: block;
        position: relative;
        bottom: 0px;
      }

      @media only screen and (max-width: 900px) {
      
        .tab {
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          background-color: #f1f1f1;
          width: 42.7vh;
        }
        
        label {
          margin-right: 10px; 
          width: 25vh;
        }

        .tab button {
          color: #000;
          float: left;
          padding: 14px 16px;
          transition: 0.3s;
          border-radius: 0;
          margin-bottom: 0;
          width: 50%;
        }

        .tabcontent {
          display: none;
          padding: 6px 12px;
          border-top: 0px;
          border-radius: 0px 0px 10px 10px;
          width: 40vh;
          height: 141vh;
          flex-wrap: wrap;
        }
        p {
          margin: 10px 0;
          display: inline-block;
          width: 22vh;
        }

              
      button {
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }
      

      #inputs,
      #summary {
        margin: 0 auto;
        width: 38vh;
        padding: 20px;
        padding-bottom: 0px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      
      #inputsFleet,
      #summaryFleet {
        margin: 0 auto;
        width: 38vh;
        padding: 20px;
        padding-bottom: 0px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      #inputsFleet {
        margin-top: 10px;
        height: 30vh;
      }

      #summary {
        height: 47vh;
        margin-bottom: 0px;
      }

      #inputs {
        margin-top: 10px;
        height: 42vh;
      }
      
      #summaryFleet {
        height: 30vh;
      }

      #busNotes,
      #fleetNotes {
        font-size: 0.8em;
      }
      }
      
      @media only screen and (max-height: 900px) {
      
        html {
          font-size: 0.8em;
        }

      .tab {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        background-color: #f1f1f1;
        width: 93.8vh;
      }
        
        label {
          margin-right: 10px; 
          width: 25vh;
        }

        .tab button {
          color: #000;
          float: left;
          padding: 14px 16px;
          transition: 0.3s;
          border-radius: 0;
          margin-bottom: 0;
          width: 50%;
        }

        .tabcontent {
          display: none;
          padding: 6px 12px;
          border-top: 0px;
          border-radius: 0px 0px 10px 10px;
          width: 90vh;
          height: 88vh;
          flex-wrap: wrap;
        }
  
        p {
          margin: 10px 0;
          display: inline-block;
          width: 22vh;
        }

              
      button {
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }
      

      #inputs,
      #summary {
        margin: 0 auto;
        width: 38vh;
        padding: 20px;
        padding-bottom: 0px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      
      #inputsFleet,
      #summaryFleet {
        margin: 0 auto;
        width: 38vh;
        padding: 20px;
        padding-bottom: 0px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      #inputsFleet {
        height: 30vh;
      }

      #summary {
        height: 52vh;
        margin-bottom: 0px;
      }

      #inputs {
        height: 52vh;
      }
      
      h2 {
        font-size: 1em;
      }

      #summaryFleet {
        height: 30vh;
      }

      #busNotes,
      #fleetNotes {
        font-size: 0.8em;
      }
      }


      @media only screen and (max-height: 850px) {
      
        .tab {
          display: flex;
          flex-wrap: wrap;
          background-color: #f1f1f1;
          width: 42.7vh;
          overflow: true;
        }
        
        label {
          margin-right: 10px; 
          width: 25vh;
        }

        .tab button {
          color: #000;
          float: left;
          padding: 14px 16px;
          transition: 0.3s;
          border-radius: 0;
          margin-bottom: 0;
          width: 50%;
        }

        .tabcontent {
          display: none;
          padding: 6px 12px;
          border-top: 0px;
          border-radius: 0px 0px 10px 10px;
          width: 40vh;
          height: 141vh;
          flex-wrap: wrap;
        }
        p {
          margin: 10px 0;
          display: inline-block;
          width: 22vh;
        }

              
      button {
        color: #fff;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }
      

      #inputs,
      #summary {
        margin: 0 auto;
        width: 38vh;
        padding: 20px;
        padding-bottom: 0px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      
      #inputsFleet,
      #summaryFleet {
        margin: 0 auto;
        width: 38vh;
        padding: 20px;
        padding-bottom: 0px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      #inputsFleet {
        margin-top: 10px;
        height: 30vh;
      }

      #summary {
        height: 47vh;
        margin-bottom: 0px;
      }

      #inputs {
        margin-top: 10px;
        height: 42vh;
      }
      
      #summaryFleet {
        height: 30vh;
      }

      #busNotes,
      #fleetNotes {
        font-size: 0.8em;
      }
      }

      `
      const styleElement = document.createElement('style');

      if (styleElement.styleSheet) {
          // IE
          styleElement.styleSheet.cssText = styles;
      } else {
          // Other browsers
          styleElement.appendChild(document.createTextNode(styles));
      }

      document.head.appendChild(styleElement);
    }
    window.onload = initializeWidget;

})();