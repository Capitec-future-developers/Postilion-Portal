import { dataBase } from './Database.js';

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.getElementById('cards');
    const subheader = document.getElementById('subheader');
    const content = document.getElementById('content');


    function showCustomerService() {
        setSubheader("Cards - Find a Card");
        content.innerHTML = `
      <section>
        <div class="error-message" id="error-message"></div>
        <div class="customer-details">
          <div class="left-details">
            <div class="field"><label for="pan">Pan</label><input type="text" id="pan" class="card-number" placeholder="Enter PAN"></div>
            <div class="field"><label for="fname">First name</label><input type="text" id="fname" class="card-number"></div>
            <div class="field"><label for="corpId">Corporate ID</label><input type="text" id="corpId" class="card-number"></div>
            <div class="field"><label for="legalId">Legal ID</label><input type="text" id="legalId" class="card-number"></div>
            <div class="field"><label for="clientId">Client host ID</label><input type="text" id="clientId" class="card-number"></div>
          </div>
          <div class="right-details">
            <div class="field"><label for="clientCode">Client code</label><input type="text" id="clientCode" class="card-number"></div>
            <div class="field"><label for="familyName">Family name</label><input type="text" id="familyName" class="card-number"></div>
            <div class="field"><label for="corpName">Corporate name</label><input type="text" id="corpName" class="card-number"></div>
            <div class="field"><label for="phone">Phone</label><input type="tel" id="phone" class="card-number" placeholder="ex: 0655511132"></div>
          </div>
        </div>`
    }
});