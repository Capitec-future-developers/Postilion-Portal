document.addEventListener("DOMContentLoaded", function () {
    const sideBar = document.querySelector(".side-bar");

    const sideBarContent = `
    <div class="head" style="width: 50px;"><img src="../img/head.png" alt="head" class="img"></div>
    <div class="side-bar-content">
        <div class="side-bar-item" id="account-products">Account Products</div>
        <div class="side-bar-item" id="accounts">Accounts</div>
        <div class="side-bar-item" id="cards">Cards</div>
        <div class="side-bar-item" id="card-programs">Card programs</div>
        <div class="side-bar-item" id="employees">Employees</div>
        <div class="side-bar-item" id="hold-response-code">Hold Response code</div>
        <div class="side-bar-item" id="retail-customers">Retail Customers</div>
        <div class="side-bar-item" id="transactions">Transactions</div>
        <div class="side-bar-item" id="historic-tran-search">Historic Tran Search</div>
    </div>
  `;

    if (sideBar) {
        sideBar.innerHTML = sideBarContent;
    }


    const items = sideBar.querySelectorAll(".side-bar-item");

    items.forEach(item => {
        item.addEventListener("click", function () {

            const id = this.id;


            console.log(`You clicked: ${id}`);


            const displayContainer = document.querySelector("#display-container");
            if (displayContainer) {
                displayContainer.innerHTML = `<h3>Data for: ${id}</h3><p>Here is the content relevant to <strong>${id}</strong>.</p>`;
            }
        });
    });
});
