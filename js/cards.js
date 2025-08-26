import { dateBase } from './Database.js';

document.addEventListener("DOMContentLoaded", function () {
    const content = document.getElementById('content');
    const subheader = document.getElementById('subheader');
    const sideBar = document.querySelector(".side-bar");

    function setSubheader(text) {
        if (subheader) subheader.textContent = text;
    }

    function showCustomerService() {
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
          <table id="client-table">
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
            const resultContainer = document.getElementById('search-result');

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

                if (found) {
                    errorMessage.textContent = '';
                    resultContainer.innerHTML = `
                        <h4>Client Details</h4>
                        <p><strong>Name:</strong> ${found.client_name} ${found.client_surname}</p>
                        <p><strong>Company:</strong> ${found.company_name}</p>
                        <p><strong>Card Number:</strong> ${found.card_number}</p>
                        <p><strong>Customer ID:</strong> ${found.customer_id}</p>
                        <p><strong>Address:</strong> ${found.address}</p>
                        <p><strong>National ID:</strong> ${found.national_id}</p>
                    `;
                } else {
                    resultContainer.innerHTML = '';
                    errorMessage.textContent = 'No client found with the given details.';
                }
            });

            clearBtn.addEventListener('click', () => {
                document.getElementById('cardNumber').value = '';
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('customerId').value = '';
                resultContainer.innerHTML = '';
                errorMessage.textContent = '';
            });
        }
    }

    if (sideBar) {
        sideBar.addEventListener('click', (e) => {
            const clicked = e.target.closest('.side-bar-item');
            if (!clicked) return;

            if (clicked.id === 'cards') {
                showCustomerService();
            }
        });
    }
});
