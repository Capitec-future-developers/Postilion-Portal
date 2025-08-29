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
        setSubheader("Cards - Find a Card");

        if (!content) return;

        content.innerHTML = `
 <section>
 <div class="error-message" id="error-message"></div>
 <div class="customer-details">
 <div class="left-details">
 <div class="field">
 <label for="cardNumber">Card Number:</label>
 <input type="text" id="cardNumber" class="card-number" placeholder="Enter Card Number">
 </div>
 <div class="field">
 <label for="lastName">Last Name:</label>
 <input type="text" id="lastName" class="card-number">
 </div>
 <div class="field">
 <label for="firstName">First Name:</label>
 <input type="text" id="firstName" class="card-number">
 </div>
 </div>
 <div class="right-details">
 <div class="field">
 <label for="customerId">Customer ID / CIF:</label>
 <input type="text" id="customerId" class="card-number" placeholder="Enter Customer ID">
 </div>
 <div class="field">
 <label for="accountNumber">Account Number:</label>
 <input type="text" id="accountNumber" class="card-number">
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
 <th>Card Number</th>
 <th>Card Sequence Number</th>
 <th>Card Status</th>
 <th>Expiry Date</th>
 <th>Card Program</th>
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

            if (clicked.id === 'cards') {
                showCards();
            }
        });
    }
});