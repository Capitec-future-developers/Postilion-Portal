import { dateBase, transactionDatabase } from './Database.js';

document.addEventListener("DOMContentLoaded", function () {
    const content = document.getElementById('content');
    const subheader = document.getElementById('subheader');
    const sideBar = document.querySelector(".side-bar");

    if (subheader) subheader.style.display = "none";

    function setSubheader(text) {
        if (subheader) {
            subheader.textContent = text;
            subheader.style.display = "block";
        }
    }

    function showCardInquiry(card) {
        setSubheader("Cards - Card Inquiry");

        if (!content) return;

        // Determine the correct status image path
        const statusImage = card.card_status_word === 'Active' ? './img/active-card.png' :
            (card.card_status_word === 'Inactive' ? './img/notactive.png' :
                card.card_status || 'N/A');

        content.innerHTML = `
 <div class="top-stuff">
 <button id="edit">Edit</button>
 <button id="active-deactivate">${card.card_status_word === 'Active' ? 'Deactivate' : 'Activate'}</button>
 <button id="place-remove-hold">Place / Remove hold</button>
 </div>

 <div class="card-inquiry-container">
 <div class="card-inquiry-table-left">
 <div class="row"><span class="title-cell">Card Number:</span><span class="content-cell">${card.card_number}</span></div>
 <div class="row"><span class="title-cell">Card Sequence:</span><span class="content-cell">${card.card_sequence_number || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Company Card:</span><span class="content-cell">${card.company_card || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Card Status:</span><span class="content-cell">${card.card_status_word ? `<img src="${statusImage}" alt="${card.card_status_word}" width="20"> ${card.card_status_word}` : 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Card Since Date:</span><span class="content-cell">${card.card_since_date || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Card Since Day:</span><span class="content-cell">${card.card_since_day || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Card Issued:</span><span class="content-cell">${card.card_issued || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Branch Code:</span><span class="content-cell">${card.branch_code || ''}</span></div>
 <div class="row"><span class="title-cell">VIP Card:</span><span class="content-cell">${card.vip_card || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">VIP Lapse Date:</span><span class="content-cell">${card.vip_lapse_date || 'N/A'}</span></div>
 </div>

 <div class="card-inquiry-table-right">
 <div class="row"><span class="title-cell">Card Program:</span><span class="content-cell">${card.card_program || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Reporting Reference:</span><span class="content-cell">${card.reporting_reference || 'No permission'}</span></div>
 <div class="row"><span class="title-cell">Company Name:</span><span class="content-cell">${card.company_name || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Hold Response Code:</span><span class="content-cell">${card.hold_response_code || 'None'}</span></div>
 <div class="row"><span class="title-cell">Expiry Date:</span><span class="content-cell">${card.expiry_date || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Expiry Day:</span><span class="content-cell">${card.expiry_day || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Card Activated:</span><span class="content-cell">${card.card_activated || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Last Updated User:</span><span class="content-cell">${card.last_updated_user || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Last Updated Date:</span><span class="content-cell">${card.last_updated_date || 'N/A'}</span></div>
 </div>
 </div>

 <div class="card-inquiry-tab">
 <div class="tab-item tabact" data-target="tab-1-content">Customers</div>
 <div class="tab-item" data-target="tab-2-content">Linked Accounts</div>
 <div class="tab-item" data-target="tab-3-content">Transactions</div>
 <div class="tab-item" data-target="tab-4-content">Security</div>
 <div class="tab-item" data-target="tab-5-content">Additional Cards</div>
 <div class="tab-item" data-target="tab-6-content">Limits</div>
 <div class="tab-item" data-target="tab-7-content">Extended Fields</div>
 <div class="tab-item" data-target="tab-8-content">Records Updates</div>
 </div>

 <!-- Customers Tab -->
 <div id="tab-1-content" class="tab-content" style="display: block;">
 <button class="unlink" id="unlink">Unlink Customer</button>
 <table class="customers-table">
 <thead>
 <tr>
 <th>Type</th>
 <th>Customer ID</th>
 <th>Name</th>
 <th>Name on Card</th>
 <th>Address</th>
 <th>National ID / SSN</th>
 <th>Date Of Birth</th>
 </tr>
 </thead>
 <tbody id="customers-table-body"></tbody>
 </table>
 </div>

 <!-- Linked Accounts Tab -->
 <div id="tab-2-content" class="tab-content" style="display: none;">
 <div>Account Linked to Card</div>
 <table class="linked-accounts-table">
 <thead>
 <tr>
 <th>Unlink</th>
 <th>Account Number</th>
 <th>Account type</th>
 <th>Nominated Account type</th>
 <th>Account Product</th>
 <th>Advanced Limits</th>
 <th>Currency</th>
 <th>Default Account Type</th>
 <th>Qualifer</th>
 <th>Account Nickname</th>
 </tr>
 </thead>
 <tbody id="linked-accounts-table"></tbody>
 </table>
 </div>

 <!-- Transactions Tab -->
 <div id="tab-3-content" class="tab-content" style="display: none;">
 <table class="transactions-table">
 <thead>
 <tr>
 <th>Tran#</th>
 <th>Realtime Date/Time</th>
 <th>Terminal Date/Time</th>
 <th>Message Type</th>
 <th>Tran Type</th>
 <th>Amount</th>
 <th>Response Code</th>
 <th>Card Number</th>
 <th>From Account</th>
 <th>To Account</th>
 </tr>
 </thead>
 <tbody id="transactions-table-body"></tbody>
 </table>
 </div>

 <!-- Other Tabs (initially hidden) -->
 <div id="tab-4-content" class="tab-content" style="display: none;">
 <button id="edit">Edit</button>
 <p>PIN Verification</p>
 
 </div>
 <div id="tab-5-content" class="tab-content" style="display: none;">
 <p>Additional Cards content goes here</p>
 </div>
 <div id="tab-6-content" class="tab-content" style="display: none;">
 <p>Limits content goes here</p>
 </div>
 <div id="tab-7-content" class="tab-content" style="display: none;">
 <p>Extended Fields content goes here</p>
 </div>
 <div id="tab-8-content" class="tab-content" style="display: none;">
 <p>Records Updates content goes here</p>
 </div>
 `;

        const tableBody = document.getElementById('linked-accounts-table');
        const unlinkBtn = document.getElementById('unlink');
        tableBody.innerHTML = "";
        if (card) {
            const row = document.createElement('tr');
            row.innerHTML =`
 <td></td>
 <td>${card.account_number}</td>
 <td>${card.account_type}</td>
 <td>${card.account_type}</td>
 <td>${card.bank}</td>
 <td>View Advanced Limits</td>
 <td>Rand</td>
 <td>Default</td>
 <td>${card.type}</td>
 <td></td>
 `;
            tableBody.appendChild(row);
        }

        const tableBody2 = document.getElementById('customers-table-body');
        tableBody2.innerHTML = "";
        if (card) {
            const row2 = document.createElement('tr');
            row2.innerHTML = `
 <td>${card.type || 'N/A'}</td>
 <td>${card.customer_id || 'N/A'}</td>
 <td>${card.client_name || 'N/A'} ${card.client_surname || ''}</td>
 <td>${card.name_on_card || 'N/A'}</td>
 <td>${card.address || 'N/A'}</td>
 <td>${card.national_id || 'N/A'}</td>
 <td>${card.date_of_birth || 'N/A'}</td>
 `;
            tableBody2.appendChild(row2);
        }

        // Add event listener for the Edit button
        const editBtn = document.getElementById('edit');
        editBtn.addEventListener('click', () => {
            enableEditMode(card);
        });

        // Add event listener for the Active/Deactivate button
        const activeDeactivateBtn = document.getElementById('active-deactivate');
        activeDeactivateBtn.addEventListener('click', () => {
            toggleCardStatus(card);
        });

        // Initialize tab functionality
        initTabs(card);
    }

    function toggleCardStatus(card) {
        // Toggle the card status
        const newStatus = card.card_status_word === 'Active' ? 'Inactive' : 'Active';
        const newStatusImage = card.card_status_word === 'Active' ? './img/notactive.png' : './img/active-card.png';

        // Update the card object
        card.card_status_word = newStatus;
        card.card_status = newStatusImage;

        // Update the database
        const index = dateBase.findIndex(c => c.card_number === card.card_number);
        if (index !== -1) {
            dateBase[index].card_status_word = newStatus;
            dateBase[index].card_status = newStatusImage;

            // Update the last updated fields
            const now = new Date();
            dateBase[index].last_updated_date = now.toLocaleDateString();
            dateBase[index].last_updated_user = "SYSTEM_ADMIN";

            console.log("Card status updated successfully:", dateBase[index]);

            // Refresh the view
            showCardInquiry(card);
        } else {
            console.error("Card not found in database");
        }
    }

    function initTabs(card) {
        const tabs = document.querySelectorAll('.tab-item');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('tabact'));
                // Add active class to clicked tab
                tab.classList.add('tabact');

                // Hide all tab contents
                tabContents.forEach(c => {
                    c.style.display = 'none';
                });

                // Show the selected tab content
                const target = document.getElementById(tab.dataset.target);
                if (target) {
                    target.style.display = 'block';

                    // Load content for specific tabs if needed
                    if (tab.dataset.target === 'tab-3-content') {
                        loadTransactions(card);
                    }
                }
            });
        });
    }

    function loadTransactions(card) {
        const transactionsTableBody = document.getElementById('transactions-table-body');
        transactionsTableBody.innerHTML = '';
        const transactions = transactionDatabase.filter(t => t.customerId === card.customer_id);

        if (transactions.length > 0) {
            transactions.forEach(t => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
 <td>${t.tranNumber}</td>
 <td>${t.realtimeDateTime}</td>
 <td>${t.terminalDateTime}</td>
 <td>${t.messageType}</td>
 <td>${t.tranType}</td>
 <td>${t.amount}</td>
 <td>${t.responseCode}</td>
 <td>${t.cardNumber}</td>
 <td>${t.fromAccount}</td>
 <td>${t.toAccount}</td>
 `;
                transactionsTableBody.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="10" style="text-align:center;">No transactions found for this card</td>`;
            transactionsTableBody.appendChild(tr);
        }
    }

    function enableEditMode(card) {
        // Hide the top buttons and tabs
        document.querySelector('.top-stuff').style.display = 'none';
        document.querySelector('.card-inquiry-tab').style.display = 'none';
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });

        // Create save and cancel buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'edit-buttons';
        buttonContainer.innerHTML = `
 <button id="save">Save</button>
 <button id="cancel">Cancel</button>
 `;
        document.querySelector('.card-inquiry-container').after(buttonContainer);

        // Convert content cells to input fields for editing
        const contentCells = document.querySelectorAll('.content-cell');
        contentCells.forEach(cell => {
            const titleElement = cell.previousElementSibling;
            const fieldName = titleElement.textContent.replace(':', '').trim().toLowerCase().replace(/\s+/g, '_');
            const originalValue = cell.textContent;

            // Skip fields that shouldn't be edited
            if (fieldName === 'card_number' || fieldName === 'reporting_reference') {
                return;
            }

            cell.innerHTML = `<input type="text" value="${originalValue}" data-field="${fieldName}">`;
        });

        // Add event listeners for save and cancel buttons
        document.getElementById('save').addEventListener('click', () => {
            saveChanges(card);
        });

        document.getElementById('cancel').addEventListener('click', () => {
            showCardInquiry(card);
        });
    }

    function saveChanges(card) {
        // Get all input fields and update the card object
        const inputs = document.querySelectorAll('.content-cell input');
        inputs.forEach(input => {
            const field = input.dataset.field;
            if (field && card.hasOwnProperty(field)) {
                card[field] = input.value;
            }
        });

        // Update the database (external Database.js)
        const index = dateBase.findIndex(c => c.card_number === card.card_number);
        if (index !== -1) {
            // Update the record in the external database
            dateBase[index] = {...card};

            // Update the last updated fields with current date and user
            const now = new Date();
            dateBase[index].last_updated_date = now.toLocaleDateString();
            dateBase[index].last_updated_user = "CURRENT_USER";

            console.log("Database updated successfully:", dateBase[index]);
        } else {
            console.error("Card not found in database");
        }

        // Return to view mode
        showCardInquiry(card);
    }

    function showCards() {
        setSubheader("Transactions - Find Transactions by Card");

        if (!content) return;

        content.innerHTML = `
 <section>
 <div class="error-message" id="error-message"></div>
 <div class="customer-detailss">
 <div class="left-details">
 <div class="field">
 <label for="cardNumber">Card Number(PAN):</label>
 <input type="text" id="cardNumber" class="card-number" placeholder="Enter Card Number">
 </div>
 <div class="field">
 <label for="lastName">From Date (Terminal):</label>
<input id="search_form:searchForm:from_date_term" type="text" name="search_form:searchForm:from_date_term" value="09/03/2025" class="post_input_cal" maxlength="10" tabindex="2">
 </div>
 <div class="field">
 <label for="firstName">To Date(Terminal)</label>
 <input id="search_form:searchForm:from_date_term" type="text" name="search_form:searchForm:from_date_term" value="09/03/2025" class="post_input_cal" maxlength="10" tabindex="2">
 </div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 <div class="field">
 <label for="Empty-box"></label>
 <input type="text" >
</div>
 </div>
 <div class="right-details">
 <div class="field">
 <label for="customerId">Frequently Used Transaction Type:</label>
 <select id="select" class="select" >
\t<option value="-1" selected="selected">&lt;ALL&gt;</option>
 <option value="Authorization request">Authorization request</option>
 <option value="Completion advise">Completion advise</option>
 <option value="Payment request">Payment request</option>
 <option value="Refund">Refund</option>
 <option value="Reversal">Reversal</option>
 <option value="Reversal Request">Reversal Request</option>
</select>
 </div>
 <div class="field">
 <label for="accountNumber">Online System:</label>
 <select id="select" class="select" >
 \t<option value="-1" selected="selected">&lt;ALL&gt;</option>
 <option value="Realtime">Realtime</option>
 <option value="Realtime2">Realtime2</option>
 <option value="TerminalDriver">TerminalDriver</option>
 <option value="TerminalDriver2">TerminalDriver2</option>
</select>
 </div>
 <div class="field">
 <label for="Empty-box">Source Node:</label>
  <select class="select" id="search_form:searchForm:source_node" name="search_form:searchForm:source_node"  size="1" style="background-color:#ffffff" tabindex="6">\t<option value="-1" selected="selected">&lt;ALL&gt;</option>
\t<option value="ActiveSrc">ActiveSrc</option>
\t<option value="AtmApp">AtmApp</option>
\t<option value="BancsSrc">BancsSrc</option>
\t<option value="BBCardManSrc">BBCardManSrc</option>
\t<option value="BranchFESrc">BranchFESrc</option>
\t<option value="BranchSrc">BranchSrc</option>
\t<option value="BSCreditSrc">BSCreditSrc</option>
\t<option value="CardManSrc">CardManSrc</option>
\t<option value="DTSrc">DTSrc</option>
\t<option value="eCentricSrc">eCentricSrc</option>
\t<option value="eCentricSrc2">eCentricSrc2</option>
\t<option value="InteconSrc">InteconSrc</option>
\t<option value="MCCSrc">MCCSrc</option>
\t<option value="MDSSrc">MDSSrc</option>
\t<option value="MobileBESrc">MobileBESrc</option>
\t<option value="NuPaySrc">NuPaySrc</option>
\t<option value="PnPSrc">PnPSrc</option>
\t<option value="POSSrc">POSSrc</option>
\t<option value="PostInject">PostInject</option>
\t<option value="PWCIssSrc">PWCIssSrc</option>
\t<option value="RTCAcqSrc">RTCAcqSrc</option>
\t<option value="RTCSrc">RTCSrc</option>
\t<option value="SaswitchSrc">SaswitchSrc</option>
\t<option value="SPARKATM2">SPARKATM2</option>
\t<option value="TellerSrc">TellerSrc</option>
\t<option value="TermAppIso">TermAppIso</option>
\t<option value="TerMPosSrc">TerMPosSrc</option>
\t<option value="TJSrc">TJSrc</option>
\t<option value="VISASrc">VISASrc</option><option value="VASSrc">VASSrc</option>
\t<option value="VisaBaseSrc">VisaBaseSrc</option>
\t
</select>
</div>
<div class="field">
 <label for="Empty-box">Message Type:</label>
 <select id="search_form:searchForm:message_type" name="search_form:searchForm:message_type" class="select" size="1" onchange="submit()" style="background-color:#ffffff" tabindex="7">\t<option value="-1" selected="selected">&lt;ALL&gt;</option>
\t<option value="0100">0100 - Authorization Request</option>
\t<option value="0120">0120 - Authorization Advice</option>
\t<option value="0200">0200 - Transaction Request</option>
\t<option value="0220">0220 - Transaction Advice</option>
\t<option value="0300">0300 - Acquirer File Update Request</option>
\t<option value="0320">0320 - Acquirer File Update Advice</option>
\t<option value="0322">0322 - Card Issuer File Update Advice</option>
\t<option value="0400">0400 - Acquirer Reversal Request</option>
\t<option value="0420">0420 - Acquirer Reversal Advice</option>
\t<option value="0520">0520 - Acquirer Reconcile Advice</option>
\t<option value="0522">0522 - Card Issuer Reconcile Advice</option>
\t<option value="0600">0600 - Admin Request</option>
\t<option value="0620">0620 - Admin Advice</option>
</select>
</div>
<div class="field">
 <label for="Empty-box">Transaction Type:</label>
 <select id="search_form:searchForm:transaction_type" name="search_form:searchForm:transaction_type" class="select" size="1" onchange="submit()" style="background-color:#ffffff" tabindex="8">\t<option value="-1" selected="selected">&lt;ALL&gt;</option>
\t<option value="00">00 - Goods and services</option>
\t<option value="01">01 - Cash withdrawal</option>
\t<option value="02">02 - Debit adjustment</option>
\t<option value="03">03 - Check cash/guarantee</option>
\t<option value="04">04 - Check verification</option>
\t<option value="05">05 - Eurocheque</option>
\t<option value="06">06 - Traveller check</option>
\t<option value="07">07 - Letter of credit</option>
\t<option value="08">08 - Giro (postal banking)</option>
\t<option value="09">09 - Goods services with cash back</option>
\t<option value="10">10 - Non-cash e.g. wire transfer</option>
\t<option value="11">11 - Quasi-cash and scrip</option>
\t<option value="12">12 - General debit</option>
\t<option value="19">19 - Fee collection</option>
\t<option value="20">20 - Returns (refund)</option>
\t<option value="21">21 - Deposit</option>
\t<option value="22">22 - Credit adjustment</option>
\t<option value="23">23 - Check deposit guarantee</option>
\t<option value="24">24 - Check deposit</option>
\t<option value="25">25 - General credit</option>
\t<option value="28">28 - Merchandise dispatch</option>
\t<option value="29">29 - Funds disbursement</option>
\t<option value="30">30 - Available funds inquiry</option>
\t<option value="31">31 - Balance inquiry</option>
\t<option value="32">32 - General inquiry</option>
\t<option value="35">35 - Full-statement inquiry</option>
\t<option value="36">36 - Merchandise inquiry</option>
\t<option value="37">37 - Card verification inquiry</option>
\t<option value="38">38 - Mini-statement inquiry</option>
\t<option value="39">39 - Linked account inquiry</option>
\t<option value="40">40 - Cardholder accounts transfer</option>
\t<option value="41">41 - Interbank accounts transfer</option>
\t<option value="42">42 - General transfer</option>
\t<option value="50">50 - Payment from account</option>
\t<option value="51">51 - Payment by deposit</option>
\t<option value="52">52 - General payment</option>
\t<option value="53">53 - Payment to account</option>
\t<option value="54">54 - Payment from account to account</option>
\t<option value="90">90 - Place hold on card</option>
\t<option value="91">91 - General admin</option>
\t<option value="92">92 - Change PIN</option>
\t<option value="93">93 - Dead-end general admin</option>
</select>
</div>
<div class="field">
 <label for="Empty-box">Response Code:</label>
  <select id="search_form:searchForm:response_code" name="search_form:searchForm:response_code" class="select" size="1" style="background-color:#ffffff" tabindex="9">\t<option value="-1" selected="selected">&lt;ALL&gt;</option>
\t<option value="-2">&lt;All Approved&gt;</option>
\t<option value="-3">&lt;All Declined&gt;</option>
\t<option value="00">00 - Approved or completed successfully</option>
\t<option value="01">01 - Refer to card issuer</option>
\t<option value="02">02 - Refer to card issuer, special condition</option>
\t<option value="03">03 - Invalid merchant</option>
\t<option value="04">04 - Pick-up card</option>
\t<option value="05">05 - Do not honor</option>
\t<option value="06">06 - Error</option>
\t<option value="07">07 - Pick-up card, special condition</option>
\t<option value="08">08 - Honor with identification</option>
\t<option value="09">09 - Request in progress</option>
\t<option value="10">10 - Approved, partial</option>
\t<option value="11">11 - Approved, VIP</option>
\t<option value="12">12 - Invalid transaction</option>
\t<option value="13">13 - Invalid amount</option>
\t<option value="14">14 - Invalid card number</option>
\t<option value="15">15 - No such issuer</option>
\t<option value="16">16 - Approved, update track 3</option>
\t<option value="17">17 - Customer cancellation</option>
\t<option value="18">18 - Customer dispute</option>
\t<option value="19">19 - Re-enter transaction</option>
\t<option value="20">20 - Invalid response</option>
\t<option value="21">21 - No action taken</option>
\t<option value="22">22 - Suspected malfunction</option>
\t<option value="23">23 - Unacceptable transaction fee</option>
\t<option value="24">24 - File update not supported</option>
\t<option value="25">25 - Unable to locate record</option>
\t<option value="26">26 - Duplicate record</option>
\t<option value="27">27 - File update edit error</option>
\t<option value="28">28 - File update file locked</option>
\t<option value="29">29 - File update failed</option>
\t<option value="30">30 - Format error</option>
\t<option value="31">31 - Bank not supported</option>
\t<option value="32">32 - Completed partially</option>
\t<option value="33">33 - Expired card, pick-up</option>
\t<option value="34">34 - Suspected fraud, pick-up</option>
\t<option value="35">35 - Contact acquirer, pick-up</option>
\t<option value="36">36 - Restricted card, pick-up</option>
\t<option value="37">37 - Call acquirer security, pick-up</option>
\t<option value="38">38 - PIN tries exceeded, pick-up</option>
\t<option value="39">39 - No credit account</option>
\t<option value="40">40 - Function not supported</option>
\t<option value="41">41 - Lost card</option>
\t<option value="42">42 - No universal account</option>
\t<option value="43">43 - Stolen card</option>
\t<option value="44">44 - No investment account</option>
\t<option value="45">45 - Account closed</option>
\t<option value="46">46 - Identification required</option>
\t<option value="47">47 - Identification cross-check required</option>
\t<option value="48">48 - No customer record</option>
\t<option value="51">51 - Not sufficient funds</option>
\t<option value="52">52 - No check account</option>
\t<option value="53">53 - No savings account</option>
\t<option value="54">54 - Expired card</option>
\t<option value="55">55 - Incorrect PIN</option>
\t<option value="56">56 - No card record</option>
\t<option value="57">57 - Transaction not permitted to cardholder</option>
\t<option value="58">58 - Transaction not permitted on terminal</option>
\t<option value="59">59 - Suspected fraud</option>
\t<option value="60">60 - Contact acquirer</option>
\t<option value="61">61 - Exceeds withdrawal limit</option>
\t<option value="62">62 - Restricted card</option>
\t<option value="63">63 - Security violation</option>
\t<option value="64">64 - Original amount incorrect</option>
\t<option value="65">65 - Exceeds withdrawal frequency</option>
\t<option value="66">66 - Call acquirer security</option>
\t<option value="67">67 - Hard capture</option>
\t<option value="68">68 - Response received too late</option>
\t<option value="69">69 - Advice received too late</option>
\t<option value="75">75 - PIN tries exceeded</option>
\t<option value="77">77 - Intervene, bank approval required</option>
\t<option value="78">78 - Intervene, bank approval required for partial amount</option>
\t<option value="79">79 - Invalid Account Number</option>
\t<option value="90">90 - Cut-off in progress</option>
\t<option value="91">91 - Issuer or switch inoperative</option>
\t<option value="92">92 - Routing error</option>
\t<option value="93">93 - Violation of law</option>
\t<option value="94">94 - Duplicate transaction</option>
\t<option value="95">95 - Reconcile error</option>
\t<option value="96">96 - System malfunction</option>
\t<option value="98">98 - Exceeds cash limit</option>
\t<option value="A1">A1 - ATC not incremented</option>
\t<option value="A2">A2 - ATC limit exceeded</option>
\t<option value="A3">A3 - ATC configuration error</option>
\t<option value="A4">A4 - CVR check failed</option>
\t<option value="A5">A5 - CVR configuration error</option>
\t<option value="A6">A6 - TVR check failed</option>
\t<option value="A7">A7 - TVR configuration error</option>
\t<option value="C0">C0 - Unacceptable PIN</option>
\t<option value="C1">C1 - PIN change failed</option>
\t<option value="C2">C2 - PIN Unblock failed</option>
\t<option value="D1">D1 - MAC Error</option>
\t<option value="E1">E1 - Prepay error</option>
\t<option value="Y1">Y1 - Offline approved (below limits)</option>
\t<option value="Y3">Y3 - Unable to go online, approved (network problems)</option>
\t<option value="Z1">Z1 - Offline declined (below limits)</option>
\t<option value="Z3">Z3 - Unable to go online, declined (network problems)</option>
</select>
</div>
<div class="field">
<label for="Empty-box">Card Acceptor ID:</label>
<select id="search_form:searchForm:network" name="search_form:searchForm:network" class="select" size="1" onchange="submit();" style="background-color:#ffffff" tabindex="10">\t<option value="-1" selected="selected">&lt;ALL&gt;</option>
</select>
</div>
<div class="field">
 <label for="Empty-box">Network Program:</label>
<select id="search_form:searchForm:network" name="search_form:searchForm:network" class="select" size="1" onchange="submit();" style="background-color:#ffffff" tabindex="10">\t<option value="-1" selected="selected">&lt;ALL&gt;</option>
</select>
</div>
<div class="field">
 <label for="Empty-box">Card Acceptor ID:</label>
 <input type="text" >
</div>
<div class="field">
 <label for="Empty-box">Terminal ID:</label>
 <input type="text" >
</div>
<div class="field">
 <label for="Empty-box">STAN:</label>
 <input type="text" >
</div>
<div class="field">
 <label for="Empty-box">Amount:</label>
 <div class="right-bottom-small"
 <div class="field">
 <label for="Empty-box"></label>
 <input id="search_form:searchForm:amount" type="text" name="search_form:searchForm:amount" value="0" class="post_input_text" maxlength="13" tabindex="21">
</div>
<div class="field">
 <label for="Empty-box"></label>
 <select id="search_form:searchForm:amount_filter_currency" name="search_form:searchForm:amount_filter_currency" class="select" size="1" style="background-color:#ffffff" tabindex="22">\t<option value="-1" selected="selected">&lt;ALL CURRENCIES&gt;</option>
\t<option value="000">AAA - &lt;none&gt;</option>
\t<option value="784">AED - U.A.E. Dirham</option>
\t<option value="004">AFA - Afghani</option>
\t<option value="971">AFN - Afghani</option>
\t<option value="008">ALL - Lek</option>
\t<option value="051">AMD - Armenian Dram</option>
\t<option value="532">ANG - Neth. Antil. Guilder</option>
\t<option value="973">AOA - Kwanza</option>
\t<option value="024">AON - New Kwanza</option>
\t<option value="032">ARS - Argentine Peso</option>
\t<option value="003">ARX - Argentina Peso</option>
\t<option value="040">ATS - Austrian Shilling</option>
\t<option value="036">AUD - Australian Dollar</option>
\t<option value="533">AWG - Aruban Guilder</option>
\t<option value="945">AYM - Azerbaijan Manat</option>
\t<option value="031">AZM - Azerbaijan Manat</option>
\t<option value="944">AZN - Azerbaijanian Manat</option>
\t<option value="977">BAM - Convertible Mark</option>
\t<option value="052">BBD - Barbados Dollar</option>
\t<option value="050">BDT - Taka</option>
\t<option value="056">BEF - Belgian Franc</option>
\t<option value="100">BGL - Lev</option>
\t<option value="975">BGN - Bulgarian Lev</option>
\t<option value="048">BHD - Bahraini Dinar</option>
\t<option value="108">BIF - Burundi Franc</option>
\t<option value="060">BMD - Bermudian Dollar</option>
\t<option value="096">BND - Brunei Dollar</option>
\t<option value="068">BOB - Boliviano (Bolivan)</option>
\t<option value="984">BOV - Mvdol</option>
\t<option value="076">BRC - Cruzeiro</option>
\t<option value="986">BRL - Brazilian Real</option>
\t<option value="044">BSD - Bahamian Dollar</option>
\t<option value="064">BTN - Ngultrum</option>
\t<option value="072">BWP - Pula</option>
\t<option value="933">BYN - Belarussian Ruble</option>
\t<option value="974">BYR - Belarussian Ruble</option>
\t<option value="084">BZD - Belize Dollar</option>
\t<option value="124">CAD - Canadian Dollar</option>
\t<option value="976">CDF - Franc Congolais</option>
\t<option value="756">CHF - Swiss Franc</option>
\t<option value="152">CLP - Chilean Peso</option>
\t<option value="157">CNH - Chinese Renminbi</option>
\t<option value="156">CNY - Yuan Renminbi</option>
\t<option value="170">COP - Colombian Peso</option>
\t<option value="970">COU - Unidad de Valor Real</option>
\t<option value="188">CRC - Costa Rican Colon</option>
\t<option value="200">CSK - Koruna</option>
\t<option value="192">CUP - Cuban Peso</option>
\t<option value="132">CVE - Cape Verde Escudo</option>
\t<option value="196">CYP - Cyprus Pound</option>
\t<option value="203">CZK - Czech Koruna</option>
\t<option value="278">DDM - Mark der DDR</option>
\t<option value="280">DEM - Deutsche Mark</option>
\t<option value="262">DJF - Djibouti Franc</option>
\t<option value="208">DKK - Danish Krone</option>
\t<option value="214">DOP - Dominican Peso</option>
\t<option value="012">DZD - Algerian Dinar</option>
\t<option value="218">ECS - Sucre - DEPRECATED</option>
\t<option value="233">EEK - Kroon (Estonian)</option>
\t<option value="818">EGP - Egyptian Pound</option>
\t<option value="232">ERN - Nakfa</option>
\t<option value="996">ESA - Spanish Peseta</option>
\t<option value="230">ETB - Ethiopian Birr</option>
\t<option value="978">EUR - Euro</option>
\t<option value="246">FIM - Markka</option>
\t<option value="242">FJD - Fiji Dollar</option>
\t<option value="238">FKP - Falkland Is. Pound</option>
\t<option value="250">FRF - French Franc</option>
\t<option value="826">GBP - Pound Sterling</option>
\t<option value="268">GEK - Georgian Coupon</option>
\t<option value="981">GEL - Lari</option>
\t<option value="288">GHC - Cedi</option>
\t<option value="936">GHS - Cedi</option>
\t<option value="292">GIP - Gibraltar Pound</option>
\t<option value="270">GMD - Dalasi</option>
\t<option value="324">GNF - Guinea Franc</option>
\t<option value="300">GRD - Drachma</option>
\t<option value="320">GTQ - Quetzal</option>
\t<option value="624">GWP - Guinea-Bissau Peso</option>
\t<option value="328">GYD - Guyana Dollar</option>
\t<option value="344">HKD - Hong Kong Dollar</option>
\t<option value="340">HNL - Lempira</option>
\t<option value="191">HRK - Kuna</option>
\t<option value="332">HTG - Gourde</option>
\t<option value="348">HUF - Forint</option>
\t<option value="360">IDR - Rupiah</option>
\t<option value="372">IEP - Irish Pound</option>
\t<option value="376">ILS - Sheqel</option>
\t<option value="356">INR - Indian Rupee</option>
\t<option value="368">IQD - Iraqi Dinar</option>
\t<option value="365">IRA - Iranian Airline Rate</option>
\t<option value="364">IRR - Iranian Rial</option>
\t<option value="352">ISK - Iceland Krona</option>
\t<option value="380">ITL - Italian Lira</option>
\t<option value="388">JMD - Jamaican Dollar</option>
\t<option value="400">JOD - Jordanian Dinar</option>
\t<option value="392">JPY - Yen</option>
\t<option value="404">KES - Kenyan Shilling</option>
\t<option value="417">KGS - Kyrgyzstan Som</option>
\t<option value="116">KHR - Riel</option>
\t<option value="174">KMF - Comoro Franc</option>
\t<option value="408">KPW - North Korean Won</option>
\t<option value="410">KRW - Won</option>
\t<option value="414">KWD - Kuwaiti Dinar</option>
\t<option value="136">KYD - Cayman Is. Dollar</option>
\t<option value="398">KZT - Tenge</option>
\t<option value="418">LAK - Kip</option>
\t<option value="422">LBP - Lebanese Pound</option>
\t<option value="144">LKR - Sri Lanka Rupee</option>
\t<option value="430">LRD - Liberian Dollar</option>
\t<option value="426">LSL - Lesotho Loti</option>
\t<option value="440">LTL - Lithuanian Litas</option>
\t<option value="442">LUF - Luxembourgh Franc</option>
\t<option value="428">LVL - Latvian Lats</option>
\t<option value="434">LYD - Libyan Dinar</option>
\t<option value="504">MAD - Moroccan Dirham</option>
\t<option value="498">MDL - Moldovan Leu</option>
\t<option value="969">MGA - Malagasy Ariary</option>
\t<option value="807">MKD - Denar</option>
\t<option value="104">MMK - Kyat</option>
\t<option value="496">MNT - Tugrik</option>
\t<option value="446">MOP - Pataca</option>
\t<option value="478">MRO - Ouguiya</option>
\t<option value="929">MRU - Mauritania ouguiya</option>
\t<option value="470">MTL - Maltese Lira</option>
\t<option value="480">MUR - Mauritius Rupee</option>
\t<option value="462">MVR - Rufiyaa</option>
\t<option value="454">MWK - Kwacha (Malawi)</option>
\t<option value="484">MXN - Mexican Peso</option>
\t<option value="979">MXV - Unidad de Inversion</option>
\t<option value="458">MYR - Malaysian Ringgit</option>
\t<option value="508">MZM - Metical</option>
\t<option value="943">MZN - Metical</option>
\t<option value="516">NAD - Namibian Dollar</option>
\t<option value="566">NGN - Naira</option>
\t<option value="558">NIO - Cordoba Oro</option>
\t<option value="528">NLG - Netherlands Guilder</option>
\t<option value="578">NOK - Norwegian Krone</option>
\t<option value="524">NPR - Nepalese Rupee</option>
\t<option value="554">NZD - New Zealand Dollar</option>
\t<option value="512">OMR - Rial Omani</option>
\t<option value="590">PAB - Balboa</option>
\t<option value="604">PEN - Nuevo Sol</option>
\t<option value="598">PGK - Kina</option>
\t<option value="608">PHP - Philippine Peso</option>
\t<option value="586">PKR - Pakistan Rupee</option>
\t<option value="985">PLN - Polish Zloty</option>
\t<option value="616">PLZ - Zloty</option>
\t<option value="620">PTE - Portuguese Escudo</option>
\t<option value="793">PTL - Pseudo-Turkish Lira</option>
\t<option value="600">PYG - Guarani</option>
\t<option value="634">QAR - Qatari Rial</option>
\t<option value="642">ROL - Romanian Leu</option>
\t<option value="946">RON - Romanian Leu</option>
\t<option value="941">RSD - Serbian Dinar</option>
\t<option value="643">RUB - Russian Ruble</option>
\t<option value="810">RUR - Russian Ruble</option>
\t<option value="646">RWF - Rwanda Franc</option>
\t<option value="682">SAR - Saudi Riyal</option>
\t<option value="090">SBD - Solomon Is. Dollar</option>
\t<option value="690">SCR - Seychelles Rupee</option>
\t<option value="737">SDA - Sudan Airline Rate</option>
\t<option value="736">SDD - Sudanese Dinar</option>
\t<option value="938">SDG - Sudanese Pound</option>
\t<option value="752">SEK - Swedish Krona</option>
\t<option value="702">SGD - Singapore Dollar</option>
\t<option value="654">SHP - St. Helena Pound</option>
\t<option value="705">SIT - Slovenian Tolar</option>
\t<option value="703">SKK - Slovak Koruna</option>
\t<option value="925">SLE - Leone</option>
\t<option value="694">SLL - Leone</option>
\t<option value="706">SOS - Somali Shilling</option>
\t<option value="968">SRD - Suriname Dollar</option>
\t<option value="728">SSP - South Sudanese Pound</option>
\t<option value="678">STD - Dobra</option>
\t<option value="930">STN - Saint Principe Dobra</option>
\t<option value="222">SVC - El Salvador Colon</option>
\t<option value="760">SYP - Syrian Pound</option>
\t<option value="748">SZL - Lilangeni</option>
\t<option value="764">THB - Baht</option>
\t<option value="972">TJS - Somoni</option>
\t<option value="795">TMM - Manat</option>
\t<option value="934">TMT - New Manat</option>
\t<option value="788">TND - Tunisian Dinar</option>
\t<option value="776">TOP - Paanga</option>
\t<option value="626">TPE - Timor Escudo</option>
\t<option value="792">TRL - Turkish Lira</option>
\t<option value="949">TRY - New Turkish Lira</option>
\t<option value="780">TTD - Trinidad Dollar</option>
\t<option value="901">TWD - New Taiwan Dollar</option>
\t<option value="158">TWN - New Taiwan Dollar</option>
\t<option value="834">TZS - Tanzanian Shilling</option>
\t<option value="980">UAH - Ukrainian Hryvnia</option>
\t<option value="804">UAK - Ukrainian Karbovanet</option>
\t<option value="800">UGX - Uganda Shilling</option>
\t<option value="840">USD - U.S. Dollar</option>
\t<option value="940">UYI - Uruguay Peso</option>
\t<option value="858">UYU - Peso Uruguayo</option>
\t<option value="860">UZS - Uzbekistan Sum</option>
\t<option value="862">VEB - Bolivar</option>
\t<option value="937">VEF - Bolivar Fuerte</option>
\t<option value="928">VES - Bolivar soberano</option>
\t<option value="704">VND - Dong</option>
\t<option value="548">VUV - Vatu</option>
\t<option value="882">WST - Tala</option>
\t<option value="950">XAF - CFA Franc BEAC</option>
\t<option value="951">XCD - E. Carribean Dollar</option>
\t<option value="954">XEU - Europe Currency Unit</option>
\t<option value="952">XOF - CFA Franc BCEAO</option>
\t<option value="953">XPF - CFP Franc</option>
\t<option value="994">XSU - Sucre</option>
\t<option value="720">YDD - Yemini Dinar</option>
\t<option value="886">YER - Yemeni Rial</option>
\t<option value="891">YUM - Yugoslavian Dinar</option>
\t<option value="890">YUN - Yugoslavian Dinar</option>
\t<option value="710">ZAR - Rand</option>
\t<option value="894">ZMK - Zambian-DEPRECATED</option>
\t<option value="967">ZMW - Zambian Kwacha</option>
\t<option value="180">ZRN - Zaire Franc</option>
\t<option value="716">ZWD - Zimbabwe-DEPRECATED</option>
\t<option value="924">ZWG - Zimbabwe Gold</option>
\t<option value="932">ZWL - Zimbabwe Dollar</option>
</select>
</div>
<div class="field">
 <label for="Empty-box"></label>
 <select id="search_form:searchForm:amount_filter_type" name="search_form:searchForm:amount_filter_type" class="select" size="1" tabindex="23">\t<option value="1" selected="selected">Greater than or equal to amount</option>
\t<option value="2">Less than or equal to amount</option>
\t<option value="3">Equal to amount</option>
</select>
</div>
</div>
</div>



 </div>
 </div>
 <div class="buttons" style="position: absolute; top: 650px;">
 <button id="search">Search</button>
 <button id="clear">Clear</button>
 </div>
 <div class="client-details">
 <table id="client-table" style="display: none;">
 <thead>
 <tr>
 <th>Card Number</th>
 <th>Card Sequence Number</th>
 <th>Card Status</th>
 <th>Expiry Date</th>
 <th>Card Program</th>
 </tr>
 </thead>
 <tbody id="client-table-body" class="client-table-body"></tbody>
 </table>
 </div>
 </section>
 `;

        const searchBtn = document.getElementById('search');
        const clearBtn = document.getElementById('clear');
        const errorMessage = document.getElementById('error-message');
        const table = document.getElementById('client-table');
        const tableBody = document.getElementById('client-table-body');

        searchBtn.addEventListener('click', () => {
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const firstName = document.getElementById('firstName').value.trim().toLowerCase();
            const lastName = document.getElementById('lastName').value.trim().toLowerCase();
            const customerId = document.getElementById('customerId').value.trim();

            const found = dateBase.find(client =>
                (cardNumber && client.card_number === cardNumber) ||
                (firstName && client.client_name && client.client_name.toLowerCase().includes(firstName)) ||
                (lastName && client.client_surname && client.client_surname.toLowerCase().includes(lastName)) ||
                (customerId && client.customer_id === customerId)
            );

            tableBody.innerHTML = '';

            if (found) {
                errorMessage.textContent = '';
                table.style.display = 'table';

                // Determine the correct status image path for the search results
                const statusImage = found.card_status_word === 'Active' ? './img/active-card.png' :
                    (found.card_status_word === 'Inactive' ? './img/notactive.png' :
                        found.card_status || 'N/A');

                const row = document.createElement('tr');
                row.innerHTML = `
 <td style="color: #1384bf; cursor: pointer;" class="card-link">${found.card_number}</td>
 <td>${found.card_sequence_number || 'N/A'}</td>
 <td>${found.card_status_word ? `<img src="${statusImage}" alt="${found.card_status_word}" width="20"> ${found.card_status_word}` : 'N/A'}</td>
 <td>${found.expiry_date || 'N/A'}</td>
 <td>${found.card_program || 'N/A'}</td>
 `;
                tableBody.appendChild(row);

                row.querySelector('.card-link').addEventListener('click', () => {
                    showCardInquiry(found);
                });

            } else {
                table.style.display = 'none';
                errorMessage.textContent = 'No client found with the given details.';
            }
        });
//yeah
        clearBtn.addEventListener('click', () => {
            document.getElementById('cardNumber').value = '';
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('customerId').value = '';

            tableBody.innerHTML = '';
            table.style.display = 'none';
            errorMessage.textContent = '';
        });
    }

    if (sideBar) {
        sideBar.addEventListener('click', (e) => {
            const clicked = e.target.closest('.side-bar-item');
            if (!clicked) return;

            if (clicked.id === 'transactions') {
                showCards();
            }
        });
    }
});