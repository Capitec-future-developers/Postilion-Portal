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

    function showAccountsNext(card) {
        setSubheader("Accounts - Find an Account");

        if (!content) return;


        const statusImage = card.card_status_word === 'Active' ? './img/active-card.png' :
            (card.card_status_word === 'Inactive' ? './img/notactive.png' :
                card.card_status || 'N/A');

        content.innerHTML = `
 

 <div class="card-inquiry-container">
 <div class="card-inquiry-table-left">
 <div class="row"><span class="title-cell">Account Number:</span><span class="content-cell">${card.account_number}</span></div>
 <div class="row"><span class="title-cell">Account Type:</span><span class="content-cell">${card.account_type || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Account Product:</span><span class="content-cell">${card.account_product || 'Capitec Business Account'}</span></div>
 <div class="row"><span class="title-cell">Currency:</span><span class="content-cell">${card.currency || 'Rand'}</span></div>
 <div class="row"><span class="title-cell">Hold Response Code:</span><span class="content-cell">${''}</span></div>
 <div class="row"><span class="title-cell">Account Nickname:</span><span class="content-cell">${card.account_nickname || ''}</span></div>
 <div class="row"><span class="title-cell">VIP Account:</span><span class="content-cell">${''}</span></div>
 <div class="row"><span class="title-cell">Compnay name:</span><span class="content-cell">${card.company_name || ''}</span></div>
 </div>

 <div class="card-inquiry-table-right">
 <div class="row"><span class="title-cell">Allow Overdraft Limits:</span><span class="content-cell"><input type="checkbox" hidden="hidden"> </span></div>
 <div class="row"><span class="title-cell"></span><span class="content-cell">${''}</span></div>
 <div class="row"><span class="title-cell">Ledger Balance:</span><span class="content-cell">${card.ledger_balance || 'ZAR 0.00'}</span></div>
 <div class="row"><span class="title-cell">Avaliable Balance:</span><span class="content-cell">${card.avilable_balance || 'ZAR 0.00'}</span></div>
 <div class="row"><span class="title-cell">Last Updated User:</span><span class="content-cell">${card.last_updated_user || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">Last Updated Date:</span><span class="content-cell">${card.last_updated_date || 'N/A'}</span></div>
 <div class="row"><span class="title-cell">VIP Lapse Date:</span><span class="content-cell">${''}</span></div>
 <div class="row"><span class="title-cell"></span><span class="content-cell">${''}</span></div>
 

 </div>
 </div>

 <div class="card-inquiry-tab">
 <div class="tab-item tabact" data-target="tab-1-contents">Cards</div>
 <div class="tab-item" data-target="tab-2-contents">Customers</div>
 <div class="tab-item" data-target="tab-3-contents">Transactions</div>
 <div class="tab-item" data-target="tab-4-contents">Extended Fields</div>
 <div class="tab-item" data-target="tab-6-contents">Record Updates</div>
 </div>

 <!--  -->
 <div id="tab-1-contents" class="tab-content" style="display: none;">
 <div><b>Card List</b></div>
 <table class="linked-accounts-table">
 <thead>
 <tr>
 <th>Card Number</th>
 <th>Card Sequnce Number</th>
 <th>Expiry Date</th>
 <th>Card Program</th>
 </tr>
 </thead>
 <tbody id="linked-accounts-table"></tbody>
 </table>
 </div>
 
  <!-- Customers Tab -->
 <div id="tab-2-contents" class="tab-content" style="display: block;">
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
 
 <!-- Transactions Tab -->
 <div id="tab-3-contents" class="tab-content" style="display: none;">
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
 <div id="tab-4-contents" class="tab-content" style="display: none; border: 1px solid #cccc; ">
 <button id="edit">Edit</button>
 <div class="categ"><span>Category</span><select style="Position: absolute; right: 10px; width: 800px; height: 15px;">
 <oprion>< All ></oprion>
 <option>Undifined</option>
 <option>SARBNoForex</option>
</select></div>
 <div class="subcateg"><'Undified'>
 <table class="transactions-table">
 <thead>
 <tr>
 <th>Field Name</th>
 <th>Value</th>
</tr>
</thead>
<tbody id="undifined-table"></tbody>
</table>
 </div>
 <div class="more-subcateg"><'SarbNoForex'>
 <table class="transactions-table">
 <thead>
 <tr>
 <th>Field Name</th>
 <th>Value</th>
 </tr>
 </thead>
 <tbody id="more-subcateg-table"></tbody>
 </table>
</div>
 </div>
 
 <div id="tab-5-contents" class="tab-content" style="display: none;">
 <p>Additional Cards content goes here</p>
 <span></span>
 </div>
 `;

        const tableBody = document.getElementById('linked-accounts-table');
        const unlinkBtn = document.getElementById('unlink');
        tableBody.innerHTML = "";
        if (card) {
            const row = document.createElement('tr');
            row.innerHTML =`
 <td>${card.card_number}</td>
 <td>${card.card_sequence_number}</td>
 <td>${card.expiry_date}</td>
 <td>${card.card_program || 'CapBusDV'}</td>
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
            showAccountsSearch(card);
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
                    if (tab.dataset.target === 'tab-3-contents') {
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
            showAccountsSearch(card);
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
        showAccountsSearch(card);
    }

    function  showAccountsSearch() {
        setSubheader("Accounts - Find Account ");

        if (!content) return;

        content.innerHTML = `
 <section>
 <div class="error-message" id="error-message"></div>
 <div class="customer-details">
 <div class="left-details">
 <div class="field">
 <label for="cardNumber">Account Number:</label>
 <input type="text" id="accountNumber" class="card-number" placeholder="Enter Card Number">
 </div>
 <div class="field">
 <label for="lastName">Account Type:</label>
 <select class="select">
 <option value="1">Any</option>
 <option value="1">Account Type 1</option>
 <option value="2">Account Type 2</option>
 <option value="3">Account Type 3</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
 <option value="4">Account Type 4</option>
</select>
 </div>
 </div>
 <div class="right-details">
  <div class="field">
 <label for="accountNumber">Card Number:</label>
 <input type="text" id="cardNumber" class="card-number">
 </div>
 <div class="field">
 <label for="customerId">Customer ID:</label>
 <input type="text" id="customerId" class="card-number" placeholder="Enter Customer ID">
 </div>
 </div>
 </div>
 <div class="buttons">
 <button id="search">Search</button>
 <button id="clear">Clear</button>
 </div>
 <div class="client-details">
 <table id="client-table" style="display: none;">
 <thead>
 <tr>
 <th>Account Number</th>
 <th>Account Type</th>
 <th>Account Product</th>
 <th>Currency</th>
 <th>Linked Via card</th>
 </tr>
 </thead>
 <tbody id="client-table-body"></tbody>
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
            const customerId = document.getElementById('customerId').value.trim();

            const found = dateBase.find(client =>
                (cardNumber && client.card_number === cardNumber) ||
                (customerId && client.customer_id === customerId)
            );

            tableBody.innerHTML = '';

            if (found) {
                errorMessage.textContent = '';
                table.style.display = 'table';


                const statusImage = found.card_status_word === 'Active' ? './img/active-card.png' :
                    (found.card_status_word === 'Inactive' ? './img/notactive.png' :
                        found.card_status || 'N/A');

                const row = document.createElement('tr');
                row.innerHTML = `
 <td style="color: #1384bf; cursor: pointer;" class="card-link">${found.account_number}</td>
 <td>${found.account_type|| 'N/A'}</td>
 <td>${found.account_product || 'N/A'}</td>
 <td>${found.currency || 'N/A'}</td>
 <td>${found.card_program || 'N/A'}</td>
 `;
                tableBody.appendChild(row);

                row.querySelector('.card-link').addEventListener('click', () => {
                    showAccountsNext(found);
                });

            } else {
                table.style.display = 'none';
                errorMessage.textContent = 'No client found with the given details.';
            }
        });
//yeah
        clearBtn.addEventListener('click', () => {
            document.getElementById('cardNumber').value = '';
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

            if (clicked.id === 'accounts') {
                showAccountsSearch();
            }
        });
    }
});