document.addEventListener("DOMContentLoaded", function () {
    const sideBar = document.querySelector(".side-bar");

    const sideBarContent = `
    <div class="head" style="width: 50px;"><img src="./img/head.png" alt="head" class="img"></div>
    <div class="side-bar-content">
    <div class="side-bar-item">Account Products</div>
    <div class="side-bar-item">Accounts</div>
    <div class="side-bar-item">Cards</div>
    <div class="side-bar-item">Card programs</div>
    <div class="side-bar-item">Employees</div>
    <div class="side-bar-item">Hold Response code</div>
    <div class="side-bar-item">Retail Customers</div>
    <div class="side-bar-item">Transactions</div>
    <div class="side-bar-item">Historic Tran Search</div>
    
</div>
  `;

    if (sideBar) {
        sideBar.innerHTML = sideBarContent;
    }
});
