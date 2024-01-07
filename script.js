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
    var tabcontents = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
      tabcontents[i].className = tabcontents[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
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
    document.getElementById('scrappageBonus').innerText = data.voucher.scrappage;
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

    let data;
    try {
      const response = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:AcokRRGS/calc-fleet-cap?fleet-size=${fleetSize}&priority-district=${priorityDistrictFleet}&electrification-plan=${electrification}`)

      data = await response.json();
    } catch (error) {
      console.log(error);
    }
    document.getElementById('baseCap').innerText = data["base-cap"];
    document.getElementById('priorityDistrictBonusFleet').innerText = data["bonus-prioritydistrict"];
    document.getElementById('electrificationBonus').innerText = data["bonus-electrification-plan"]
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
        <div>
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
               </div>
               <div>
               <em><strong>Disclaimer:</strong> This calculator is for illustrative purposes only and accuracy is not guaranteed. The figures shown can vary based
                 on your individual situation. NYSBIP rules are always subject to change and this calculator may not reflect that. Please
                 consult an expert before depending on these results.</em>
                 </div>
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
      <div> 
        <p>Base Voucher: </p>
        <div><span>$</span><span class="voucher" id="baseVoucher">-</span></div>
      </div>
      <div>
        <p>Priority District Bonus: </p>
        <div>
          <span>$</span><span class="voucher" id="priorityDistrictBonus">-</span>   
        </div>
      </div>
      <div> <p>Scrappage Bonus: </p><div><span>$</span><span class="voucher" id="scrappageBonus">-</span></div> </div>
      <div><p>V2G Add-On: </p>
<div><span>$</span><span class="voucher" id="v2gAddOn">-</span></div> </div>
      <div>  <p>Wheelchair Add-On: </p><div><span>$</span><span class="voucher" id="wheelchairAddOn">-</span></div> </div>
      <hr>
      <div>
        <p>Total Possible NYSBIP Voucher: </p>
        <div><span>$</span><span class="voucher" id="totalVoucher">-</span></div>
      </div>

     <h2 id="final-summary">SUMMARY</h2>
      <div> 
        <p>Bus Purchase Price: </p>
        <div><span>$</span><span class="voucher" id="finalPurchasePrice">-</span></div>
      </div>
      <div>
        <p>Actual NYSPIB Voucher: </p>
        <div><span>$</span><span class="voucher" id="actualVoucher">-</span></div>
      </div>
      <hr>
      <div>
        <p>Your Out of Pocket: </p>
        <div><span>$</span><span class="voucher" id="outOfPocket">-</span></div>
      </div>

        `);
    const busVoucherNotesSection = createHelpNotesSection('busNotes');
    const busVoucherFooter = createFooter('bus');

    const fleetCapsSection = createInputSection('inputsFleet', 'INPUTS', fleetCapsInputs, "fleetCalcButton");
    const fleetCalcButton = `<button id="fleetCalcButton" onclick="calculateFleet()">Calculate</button>`;
    fleetCapsSection.innerHTML += fleetCalcButton;
    const fleetCapsSummarySection = createSummarySection('summaryFleet', 'RESULTS', `
    <div> 
      <p>Base Cap: </p>
      <div><span>$</span><span class="voucher" id="baseCap">-</span></div>
    </div>
     

      <div>    
        <p>Priority District Bonus:</p>
        <div>
          <span>$</span><span class="voucher" id="priorityDistrictBonusFleet">-</span>
       </div>
      </div>


    <div> 
      <p>Fleet Electrification Plan Bonus: 
      <div>
        </p><span>$</span><span class="voucher" id="electrificationBonus">-</span> 
      </div>
    </div>
  
    <hr>
    <div>
      <p>Total # of Bus Vouchers Eligible: <div></p><span>$</span><span class="voucher" id="totalCap">-</span></div></div>
  
     
      `);
    const fleetCapsNotesSection = createHelpNotesSection('fleetNotes');
    const fleetCapsFooter = createFooter('fleet');

    const busCalculator = document.getElementById('busCalculator');
    busCalculator.innerHTML = `
      <div class='header' >
          <h1 id="heading">NYSBIP CALCULATOR</h1>
          <div class="tab">
          <button class="tablinks" id="busVoucherButton">Single Bus Voucher</button>
          <button class="tablinks" id="fleetwideButton">Fleetwide Caps</button>
          </div>
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
      *{
          margin:0;
          padding:0;
          box-sizing:border-box;

      }
      html{
        font-size:10px;
      }
      .header{
        margin-bottom:2rem;
      }
      .hidden {
          display: none;
      }
      #busCalculator {
        max-width: 1400px;
        margin:0 auto;
        padding: 1rem;
      }
      #heading {
        font-size: 3rem;
        text-align: center;
        margin: 0;
        padding: 0;
      }
      .tab{
        margin:8px 0;
        display:flex;
        justify-content: space-around;
        gap:4px;
      }
      .tab .tablinks{
        width:40%;
        font-size: 12px;
        border:1px solid black;
        background: #14248A;
        color:white;
        border-radius:4px;
        padding:1rem;
      }
      .tabcontent {
        display:none;
        flex-direction: column;
        gap:1rem;
      }
      .tabcontent.active {
        display:flex;
        flex-direction: column;
      }
      
      fieldset {
        border: 4px solid #14248A;
        border-radius: 4px;
        padding: 1rem;
        display:flex;
        flex-direction:column;
        gap:1.5rem;
        font-size:1.6rem;
      }
      legend {
        font-size: 1.8rem;
        font-weight: medium;
        color: #14248A;
        padding: 0 0.5rem;
      }
      hr{
        border:1px solid #14248A;
      }
      input {
        border: 1px solid #14248A;
        border-radius: 4px;
        padding: 0.5rem;
      }
      #inputs div,
      #inputsFleet div {
        display:flex;
        justify-content:space-between;
        align-items:center;
      }
      #inputs button,
      #inputsFleet button{
        width:100%;
        padding:1rem;
        border:1px solid black;
        background: #14248A;
        color:white;
        border-radius:4px;
        font-size:1.6rem;
      }
      #calculations {
        display:flex;
        flex-direction:column;
        gap:1rem;
      }
      #calculations>div{
        display:flex;
        justify-content:space-between;
        align-items:center;
      }
      #final-summary{
        font-size:1.8rem;
        font-weight: medium;
        margin-top:2rem;
        color: #14248A;
      }
      #busNotes {
        font-size:1.4rem;
        padding:2rem;
        display:flex;
        flex-direction:column;
        gap:2rem;
      }
       #busNotes>div h3 {
        margin-bottom:1rem;
       }
       #busNotes>div ol{
        padding-left:2rem;
       }
      #busFooter {
        font-size:1.4rem;
        padding:1rem;
        text-align:center;
        background-color:#14248A;
        color:white;

      }
      #busFooter a {
        text-decoration:underline;
        color:white;
      }
      @media screen and (min-width: 768px) {
        .tabcontent.active {
          flex-direction: row;
          flex-wrap:wrap;

        }
        #inputs,#summary,
        #inputsFleet,#summaryFleet {
          flex-basis:45%;
          flex:1;
        }
        .tabcontent.active #busFooter{
          width:100%;
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