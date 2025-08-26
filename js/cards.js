import { dateBase } from './Database.js';

document.addEventListener("DOMContentLoaded", function () {
    const content = document.getElementById('content');
    const subheader = document.getElementById('subheader');
    const sideBar = document.querySelector(".side-bar");
    const cardInquiry = document.getElementById('card-inquiry');



    if (subheader) {
        subheader.style.display = "none";
    }

    function setSubheader(text) {
        if (subheader) {
            subheader.textContent = text;
            subheader.style.display = "block";
        }
    }

    // Show Card Inquiry top buttons
    function showCardInquiry(cardNumber) {
        setSubheader("Cards - Card Inquiry");

        if (!content) return;

        content.innerHTML = `
            <div class="top-stuff">
                <button id="edit">Edit</button>
                <button id="active-deactivate">Active/Deactivate</button>
                <button id="place-remove-hold">Place / Remove hold</button>
                <p style="margin-top:10px;">Card Number: <strong>${cardNumber}</strong></p>
            </div>
        `;
    }


    function showCards() {
        setSubheader("Cards - Find a Card");

        if (content) {
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
                    (firstName && client.client_name.toLowerCase() === firstName) ||
                    (lastName && client.client_surname.toLowerCase() === lastName) ||
                    (customerId && client.customer_id === customerId)
                );

                tableBody.innerHTML = ''; // clear old results

                if (found) {
                    errorMessage.textContent = '';
                    table.style.display = 'table'; // show table

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="color: #1384bf; cursor: pointer;" id="card-inquiry">${found.card_number}</td>
                        <td>${found.card_sequence_number || 'N/A'}</td>
                        <td>
                            ${found.card_status
                        ? `<img src="${found.card_status}" alt="status" width="20">`
                        : 'N/A'}
                        </td>
                        <td>${found.expiry_date || 'N/A'}</td>
                        <td>${found.card_program || 'N/A'}</td>
                    `;
                    tableBody.appendChild(row);
                } else {
                    table.style.display = 'none'; // hide if not found
                    errorMessage.textContent = 'No client found with the given details.';
                }
            });

            clearBtn.addEventListener('click', () => {
                document.getElementById('cardNumber').value = '';
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('customerId').value = '';

                tableBody.innerHTML = '';
                table.style.display = 'none'; // hide table again
                errorMessage.textContent = '';
            });
        }
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
