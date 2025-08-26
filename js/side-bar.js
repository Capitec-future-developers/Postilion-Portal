document.addEventListener("DOMContentLoaded", function () {
    const sideBar = document.querySelector(".side-bar");
    const subheader = document.getElementById('subheader');

    const sideBarContent = `
        <div class="head" style="width: 50px;"><img src="./img/head.png" alt="head" class="img"></div>
        <div class="side-bar-content" id="subheader">
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
});
