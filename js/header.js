document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");

    const headerContent = `
    <div class="header-content">
    <div class="sub-header">Financial Institution Home</div>
                <div class="header-item">
                    <div class="items">
                        <span>User:</span>
                        <span>CP378455</span>
                    </div>
                    <div class="items" style="position: absolute; left: -1px; top: 50px;">
                        <span>Last Login:</span>
                        <span>None</span>
                    </div>
                    <div class="items">
                        <span>Financial Institution:</span>
                        <span>Business</span>
                    </div>
                    <div class="items" style="position: absolute; left: 260px; top: 50px;">
                        <span>Institution ID:</span>
                        <span></span>
                    </div>
                    <div class="items">
                        <span>Issuer:</span>
                        <span>CapitecBusiness</span>
                    </div>
                    <div class="items" style="position: absolute; top: 50px; left: 610px;">
                        <span>Participant:</span>
                        <span>Capitec Bank</span>
                    </div>
                </div>
                <div class="bottom-items-right">
                    <span>My Profile|</span>
                    <span>Logout|</span>
                    <span>HowTo|</span>
                    <span>About</span>
                </div>
            </div>

`;

    if (header) {
        header.innerHTML = headerContent;
    }

    }
);