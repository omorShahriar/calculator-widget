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

  async function getEligibleBuses() {
    try {
      const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/nybsip-eligible-esb-list');
      const data = await response.json();
      data.forEach(bus => {
        const eligibleBusesTableRow = document.createElement('tr');
        eligibleBusesTableRow.innerHTML = `
          <td>${bus.bus_type}</td>
          <td>${bus.estimated_range}</td>
          <td>${bus.manufacturer}</td>
          <td>${bus.model}</td>
          <td>${bus.model_year}</td>
          <td>${bus.new_repower}</td>
          <td><p class='modalOpener'>more</p></td>
        `;
        eligibleBusesTableBody.appendChild(eligibleBusesTableRow);

      }
      );
      const modalOpeners = document.getElementsByClassName('modalOpener');
      for (let i = 0; i < modalOpeners.length; i++) {
        const modalOpener = modalOpeners[i];
        modalOpener.onclick = () => {
          clearModal();
          openModal(data[i].id)
        };
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  async function getOneBus(busId) {
    try {
      const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/nybsip-single-bus-data?nybsip_eligible_esb_list_id=${busId}`);
      const data = await response.json();


      const eligibleBusesModal = document.getElementById('busModal');

      const eligibleBusesModalContent = document.createElement('div');
      eligibleBusesModalContent.className = 'modal-content';

      const eligibleBusesModalHeader = document.createElement('div');
      eligibleBusesModalHeader.className = 'modal-header';
      eligibleBusesModalHeader.innerHTML = `
    <h2>Bus Details</h2>
    <button type="button" class="close" id="closeModalButton">X</button>
    `;

      const eligibleBusesModalBody = document.createElement('div');
      eligibleBusesModalBody.className = 'modal-body';
      eligibleBusesModalBody.innerHTML = `
        <table class="modal-table">
          <tr>
            <th>Type</th>
            <td>${data.bus_type}</td>
          </tr>
          <tr>
            <th>Rated Power(kW)</th>
            <td>${data.rated_power}</td>
          </tr>
          <tr>
            <th>Estimated Range</th>
            <td>${data.estimated_range}</td>
          </tr>
          <tr>
            <th>Fuel Type</th>
            <td>${data.fuel_type}</td>
          </tr>
          <tr>
            <th>Manufacturer</th>
            <td>${data.manufacturer}</td>
          </tr>
          <tr>
            <th>Model</th>
            <td>${data.model}</td> 
          </tr>
          <tr>
            <th>Model Year</th>
            <td>${data.model_year}</td>
          </tr>
          <tr>
            <th>New/Repower</th>
            <td>${data.new_repower}</td>
          </tr>
          <tr>
            <th>GVWR (lbs)</th>
            <td>${data.gvwr}</td>
          </tr>
          <tr>
            <th>Seating Capacity</th>
            <td>${data.seating_capacity}</td>
          </tr>
          <tr>
            <th>V2G Add-On Available</th>
            <td>${data.v2g_addon}</td>
          </tr>
          <tr>
            <th>Wheelchair Add-On Available</th>
            <td>${data.wheelchair_addon}</td>
          </tr>
          <tr>
            <th>Base Voucher Amount</th>
            <td>${data.base_voucher}</td>
          </tr>
          <tr>
            <th>Added Date</th>
            <td>${data.added_date}</td>
          </tr>
        </table>
      `;

      const eligibleBusesModalFooter = document.createElement('div');
      eligibleBusesModalFooter.className = 'modal-footer';

      var contractorsArray = data.contractors.split('\n\n\n');

      var container = document.createElement('div');
      var contractorHeader = document.createElement('h3');
      contractorHeader.textContent = 'Contractor(s)';
      container.appendChild(contractorHeader);
      contractorsArray.forEach(function (contractorInfo) {
        var contractorLines = contractorInfo.split('\n');
        var contractorDiv = document.createElement('div');

        contractorLines.forEach(function (line, index) {
          var element = document.createElement(index === 0 ? 'strong' : 'span');
          element.textContent = line;
          contractorDiv.appendChild(element);

          if (index < contractorLines.length - 1) {
            contractorDiv.appendChild(document.createElement('br'));
          }
        });

        container.appendChild(contractorDiv);
      });

      eligibleBusesModalFooter.appendChild(container);

      eligibleBusesModalContent.appendChild(eligibleBusesModalHeader);
      eligibleBusesModalContent.appendChild(eligibleBusesModalBody);
      eligibleBusesModalContent.appendChild(eligibleBusesModalFooter);
      eligibleBusesModal.appendChild(eligibleBusesModalContent);

      const closeModalButton = document.getElementById('closeModalButton');
      closeModalButton.onclick = () => closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  function openModal(id) {
    document.getElementById('busModal').style.display = 'block';
    getOneBus(id);
  }

  function clearModal() {
    var elements = document.getElementsByClassName("modal-content");

    var elementsArray = Array.from(elements);

    elementsArray.forEach(function (element) {
      element.remove();
    });

  }

  function closeModal() {
    clearModal();
    document.getElementById('busModal').style.display = 'none';
  }


  function attachResetEventListeners() {
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');

    function handleInputChange() {
      reset();
    }

    inputs.forEach((input) => {
      input.addEventListener('input', handleInputChange);
    });

    selects.forEach((select) => {
      select.addEventListener('input', handleInputChange);
    });
  }

  function openTab(evt, taskName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    var tabcontents = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
      tabcontents[i].className = tabcontents[i].className.replace(" active", "");
    }

    document.getElementById(taskName).style.display = "flex";
    document.getElementById(taskName).className += " active";
    evt.currentTarget.className += " active";
  }

  window.calculateVoucher = async function calculateVoucher() {
    const busId = document.getElementById('busType').value;
    const priorityDistrict = document.getElementById('priorityDistrict').checked;
    const scrappage = document.getElementById('scrappingICE').checked;
    const v2g = document.getElementById('v2gFeature').checked;
    const wheelchair = document.getElementById('wheelchair').checked;
    const purchasePrice = document.getElementById('purchasePrice').value;
    const purchasePriceInNumber = purchasePrice.replace(/[,$]/g, '');

    // show error if purchase price is not a number
    if (isNaN(purchasePriceInNumber)) {
      alert('Please enter a valid number for purchase price');
      return;
    }
    const button = document.getElementById('busCalcButton');
    button.innerText = "Calculating..."
    let data;
    try {
      const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/calc-voucher?bus_id=${busId}&priority-district=${priorityDistrict}&scrappage=${scrappage}&v2g=${v2g}&wheelchair=${wheelchair}&purchase_price=${parseFloat(purchasePriceInNumber)}`);
      data = await response.json();
    } catch (error) {
      console.log(error);
    }
    document.getElementById('baseVoucher').innerText = data.voucher.base_voucher.toLocaleString();
    document.getElementById('priorityDistrictBonus').innerText = data.voucher.prioritydistrict.toLocaleString();
    document.getElementById('scrappageBonus').innerText = data.voucher.scrappage.toLocaleString();
    document.getElementById('v2gAddOn').innerText = data.voucher.v2g.toLocaleString();
    document.getElementById('wheelchairAddOn').innerText = data.voucher.wheelchair.toLocaleString();
    document.getElementById('totalVoucher').innerText = data.voucher.total.toLocaleString();

    document.getElementById('finalPurchasePrice').innerText = data.summary.purchase_price.toLocaleString();
    document.getElementById('actualVoucher').innerText = data.summary.total_voucher.toLocaleString();
    document.getElementById('outOfPocket').innerText = data.summary.out_of_pocket.toLocaleString();
    button.innerText = "Calculate"
  }

  window.calculateFleet = async function calculateFleet() {
    const priorityDistrictFleet = document.getElementById('priorityDistrictFleet').checked;
    const electrification = document.getElementById('electrification').checked;
    const fleetSize = document.getElementById('fleetSize').value;
    const fleetSizeInNumber = fleetSize.replace(/[,$]/g, '');

    // show error if fleet size is not a number
    if (isNaN(fleetSizeInNumber)) {
      alert('Please enter a valid number for fleet size');
      return;
    }
    const button = document.getElementById('fleetCalcButton');
    button.innerText = "Calculating..."
    let data;
    try {
      const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/calc-fleet-cap?fleet-size=${parseFloat(fleetSizeInNumber)}&priority-district=${priorityDistrictFleet}&electrification-plan=${electrification}`)

      data = await response.json();
    } catch (error) {
      console.log(error);
    }
    document.getElementById('baseCap').innerText = data["base-cap"].toLocaleString();
    document.getElementById('priorityDistrictBonusFleet').innerText = data["bonus-prioritydistrict"].toLocaleString();
    document.getElementById('electrificationBonus').innerText = data["bonus-electrification-plan"].toLocaleString();
    document.getElementById('totalCap').innerText = data["voucher-cap"].toLocaleString();
    button.innerText = "Calculate"
  }

  window.reset = async function reset() {
    const vouchers = document.getElementsByClassName('voucher');
    for (let i = 0; i < Object.keys(vouchers).length; i++) {
      const key = String(i);
      const value = vouchers[key];

      value.innerText = '0';
    }
  }

  async function initializeWidget() {
    generateBusCalculator();
    const busVoucherButton = document.getElementById('busVoucherButton');
    busVoucherButton.classList.add('active');
    await getBusTypes();
    await getEligibleBuses();
    attachResetEventListeners();
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
        <div>
          <h3>Help Notes:</h3>
               <ol>
                 <li>Choose either a new bus or a repower of your existing vehicle. Only the vehicle types shown are covered.</li>
                 <li>Enter the manufacturer's full purchase price, including all options and fees.</li>
                 <li>A bonus is available if your bus is operated in a Priority District. Priority Districts include SED-designated High Need/Resource Capacity districts and districts that serve Disadvantaged Communities (DACs). This bonus may also apply for school buses that are stored in an existing depot that is situated in a DAC.
                   <ul>
                     <li><a href="https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Electric-School-Bus/NYSBIP-Priority-district-list.pdf" target="_blank">Click here</a> for a list of Priority Districts</li>
                     <li><a href="https://www.nyserda.ny.gov/ny/disadvantaged-communities" target="_blank">Click here</a> for a map of DACs (Disadvantaged Communities)</li>
                   </ul>
                 </li>
                 <li>If you scrap an eligible bus you can receive additional funds. Applies only to new buses and not repowers.</li>
                 <li>If your new bus (or repower) has the V2G (Vehicle to Grid) feature you are eligible for additional money.</li>
                 <li>If your new bus has a wheelchair, you are eligible for additional money. Repowers are not eligible</li>
               </ol>
               </div>
               <div>
               <em><strong>Disclaimer:</strong> This calculator is for illustrative purposes only and accuracy is not guaranteed. The figures shown can vary based
                 on your individual situation. NYSBIP rules are always subject to change and this calculator may not reflect that. Please
                 consult an expert before depending on these results.</em>
                 </div>
          `;
      } else if (id === 'fleetNotes') {
        notesDiv.innerHTML = `
        <div>
          <h3>Help Notes:</h3>
               <ol>
                 <li>Enter your total fleet size (i.e. number of buses in your current fleet).</li>
                 <li>A bonus is available if your bus is operated in a Priority District. Priority Districts include SED-designated High Need/Resource Capacity districts and districts that serve Disadvantaged Communities (DACs). This bonus may also apply for school buses that are stored in an existing depot that is situated in a DAC.
                   <ul>
                     <li><a href="https://www.nyserda.ny.gov/-/media/Project/Nyserda/Files/Programs/Electric-School-Bus/NYSBIP-Priority-district-list.pdf" target="_blank">Click here</a> for a list of Priority Districts</li>
                     <li><a href="https://www.nyserda.ny.gov/ny/disadvantaged-communities" target="_blank">Click here</a> for a map of DACs (Disadvantaged Communities)</li>
                   </ul>
                 </li>
                 <li> Districts and Third Party Operators may apply for a greater number of vouchers within the first two (2) years of NYSBIP if they complete an approved Fleet Electrification Plan demonstrating Utility engagement for Charging Infrastructure design a timeline for receiving ESBs, and other requirements.</li>
               </ol>
               </div>
               <div>
               <em><strong>Disclaimer:</strong> This calculator is for illustrative purposes only and accuracy is not guaranteed. The figures shown can vary based
                 on your individual situation. NYSBIP rules are always subject to change and this calculator may not reflect that. Please
                 consult an expert before depending on these results.</em>
                 </div>
          `;
      } else if (id === 'eligibleBusesNotes') {
        notesDiv.innerHTML = `
         <div>
               <em><strong>Disclaimer:</strong> All specifications are as each manufacturer has submitted to NYSERDA</em>
                 </div>
          `;
      }

      return notesDiv;
    };

    const createFooter = () => {
      const footer = document.createElement('footer');
      footer.id = `footer`;
      footer.innerHTML = `
          <em>Provided by <a href="http://www.spectivate.com" target="_blank">Spectivate LLC</a></em>
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
    const inputs = document.getElementsByTagName("input");
    const busVoucherSummarySection = createSummarySection('summary', 'RESULTS', `
      <div> 
        <p>Base Voucher: </p>
        <div><span>$</span><span class="voucher voucherBus" id="baseVoucher">-</span></div>
      </div>
      <div>
        <p>Priority District Bonus: </p>
        <div>
          <span>$</span><span class="voucher voucherBus" id="priorityDistrictBonus">-</span>   
        </div>
      </div>
      <div> <p>Scrappage Bonus: </p><div><span>$</span><span class="voucher voucherBus" id="scrappageBonus">-</span></div> </div>
      <div><p>V2G Add-On: </p>
<div><span>$</span><span class="voucher voucherBus" id="v2gAddOn">-</span></div> </div>
      <div>  <p>Wheelchair Add-On: </p><div><span>$</span><span class="voucher voucherBus" id="wheelchairAddOn">-</span></div> </div>
      <hr>
      <div>
        <p>Total Possible NYSBIP Voucher: </p>
        <div><span>$</span><span class="voucher voucherBus" id="totalVoucher">-</span></div>
      </div>

     <h2 id="final-summary">SUMMARY</h2>
      <div class="summary"> 
        <p>Bus Purchase Price: </p>
        <div><span>$</span><span class="voucher voucherBus" id="finalPurchasePrice">-</span></div>
      </div>
      <div class="summary">
        <p>Actual NYSPIB Voucher: </p>
        <div><span>$</span><span class="voucher voucherBus" id="actualVoucher">-</span></div>
      </div>
      <hr>
      <div class="summary">
        <p>Your Out of Pocket: </p>
        <div><span>$</span><span class="voucher voucherBus" id="outOfPocket">-</span></div>
      </div>

        `);
    const busVoucherNotesSection = createHelpNotesSection('busNotes');


    const fleetCapsSection = createInputSection('inputsFleet', 'INPUTS', fleetCapsInputs, "fleetCalcButton");
    const fleetCalcButton = `<button id="fleetCalcButton" onclick="calculateFleet()">Calculate</button>`;
    fleetCapsSection.innerHTML += fleetCalcButton;
    const fleetCapsSummarySection = createSummarySection('summaryFleet', 'RESULTS', `
    <div> 
      <p>Base Cap: </p>
      <div><span class="voucher voucherFleet" id="baseCap">-</span></div>
    </div>
     

      <div>    
        <p>Priority District Bonus:</p>
        <div>
          <span class="voucher voucherFleet" id="priorityDistrictBonusFleet">-</span>
       </div>
      </div>


    <div> 
      <p>Fleet Electrification Plan Bonus: 
      <div>
        </p><span class="voucher voucherFleet" id="electrificationBonus">-</span> 
      </div>
    </div>
  
    <hr>
    <div>
      <p>Total # of Bus Vouchers Eligible: <div></p><span class="voucher voucherFleet" id="totalCap">-</span></div></div>
  
     
      `);
    const fleetCapsNotesSection = createHelpNotesSection('fleetNotes');



    const eligibleBusesTable = document.createElement('table');
    eligibleBusesTable.className = 'scrollable-table';
    eligibleBusesTable.innerHTML = `
      <thead>
        <tr>
          <th>Bus Type</th>
          <th>Estimated Range</th>
          <th>Manufacturer</th>
          <th>Model</th>
          <th>Model Year</th>
          <th>New/Repower</th>
          <th>Details</th>
        </tr>
      </thead>
    `;
    const eligibleBusesTableBody = document.createElement('tbody');
    eligibleBusesTableBody.id = 'eligibleBusesTableBody';
    eligibleBusesTable.appendChild(eligibleBusesTableBody);


    const eligibleBusesModal = document.createElement('div');
    eligibleBusesModal.id = 'busModal';
    eligibleBusesModal.className = 'modal';
    const eligibleBusesNotesSection = createHelpNotesSection('eligibleBusesNotes');

    const footer = createFooter();
    const busCalculator = document.getElementById('busCalculator');
    busCalculator.innerHTML = `
      <div class='header' >
          <h1 id="heading">NYSBIP CALCULATOR</h1>
          <div class="tab">
          <button class="tablinks" id="busVoucherButton">Single Bus Voucher</button>
          <button class="tablinks" id="fleetwideButton">Fleetwide Caps</button>
          <button class="tablinks" id="eligibleBusButton">Eligible Buses</button>
          </div>
      </div>
        <div id="singleBusVoucher" class="tabcontent active">
          ${busVoucherSection.outerHTML}
          ${busVoucherSummarySection.outerHTML}
          ${busVoucherNotesSection.outerHTML}
          ${footer.outerHTML}
        </div>
        <div id="fleetwideCaps" class="tabcontent">
          ${fleetCapsSection.outerHTML}
          ${fleetCapsSummarySection.outerHTML}
          ${fleetCapsNotesSection.outerHTML}
          ${footer.outerHTML}
        </div>
        <div id="eligibleBuses" class="tabcontent">
          ${eligibleBusesTable.outerHTML}
          ${eligibleBusesModal.outerHTML}
          ${eligibleBusesNotesSection.outerHTML}
          ${footer.outerHTML}
        </div>
      `;
    const busTabButton = document.getElementById('busVoucherButton');
    busTabButton.onclick = (event) => openTab(event, 'singleBusVoucher');

    const fleetTabButton = document.getElementById('fleetwideButton');
    fleetTabButton.onclick = (event) => openTab(event, 'fleetwideCaps');

    const eligibleBusButton = document.getElementById('eligibleBusButton');
    eligibleBusButton.onclick = (event) => openTab(event, 'eligibleBuses');

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
        gap:1.5rem;
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
      #busCalculator input {
        border: 1px solid ${styleConfig.primaryColor};
        border-radius: 1.2em;
        padding: 0.5em;
        background:white;
      }
      #inputs div,
      #inputsFleet div {
        display:flex;
        justify-content:space-between;
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
        max-height: calc(100vh - 100px);
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