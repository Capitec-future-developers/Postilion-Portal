document.addEventListener("DOMContentLoaded", () => {
    // Configuration
    const AUTOMATION_STEP_DELAY = 2000; // 2 seconds between steps
    const BUBBLE_DISPLAY_TIME = 12000;

    // Navigation options based on app features
    const navigationOptions = [
        {
            name: "Cards Navigation",
            steps: [
                "Click on Cards in the sidebar",
                "Enter card details in search fields",
                "Click Search to find cards",
                "Click on a card number to view inquiry",
                "Explore tabs like Transactions"
            ]
        },
        {
            name: "Customers Navigation",
            steps: [
                "Click on Customers in the sidebar",
                "View the list of customers",
                "Check customer details in the table"
            ]
        },
        {
            name: "Transactions Navigation",
            steps: [
                "Click on Transactions in the sidebar",
                "View the list of transactions",
                "Check transaction details in the table"
            ]
        }
    ];

    const frequentOptions = ["Cards Navigation", "Customers Navigation", "Transactions Navigation"];
    let bubbles = [];
    let currentAutomation = null;
    let currentAutomationInterval = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    const automationActions = {
        "Cards Navigation": [
            () => {
                const cardsItem = document.querySelector('#cards');
                if (cardsItem) {
                    cardsItem.click();
                    return true;
                }
                return false;
            },
            () => {
                const cardNumberInput = document.getElementById('cardNumber');
                if (cardNumberInput) {
                    cardNumberInput.value = '4016000011163734'; // Example value
                    return true;
                }
                return false;
            },
            () => {
                const searchBtn = document.getElementById('search');
                if (searchBtn) {
                    searchBtn.click();
                    return true;
                }
                return false;
            },
            () => {
                const cardLink = document.querySelector('.card-link');
                if (cardLink) {
                    cardLink.click();
                    return true;
                }
                return false;
            },
            () => {
                const transactionsTab = document.querySelector('.tab-item[data-target="tab-3-content"]');
                if (transactionsTab) {
                    transactionsTab.click();
                    return true;
                }
                return false;
            }
        ],
        "Customers Navigation": [
            () => {
                const customersItem = document.querySelector('#customers');
                if (customersItem) {
                    customersItem.click();
                    return true;
                }
                return false;
            },
            () => {
                console.log('Viewing customers list');
                return true;
            },
            () => {
                console.log('Checking customer details');
                return true;
            }
        ],
        "Transactions Navigation": [
            () => {
                const transactionsItem = document.querySelector('#transactions');
                if (transactionsItem) {
                    transactionsItem.click();
                    return true;
                }
                return false;
            },
            () => {
                console.log('Viewing transactions list');
                return true;
            },
            () => {
                console.log('Checking transaction details');
                return true;
            }
        ]
    };

    const highlightSelectors = {
        "Cards Navigation": [
            '#cards',
            '#cardNumber',
            '#search',
            '.card-link',
            '.tab-item[data-target="tab-3-content"]'
        ],
        "Customers Navigation": [
            '#customers',
            '.customers-table',
            '.customers-table tbody tr'
        ],
        "Transactions Navigation": [
            '#transactions',
            '.transactions-table',
            '.transactions-table tbody tr'
        ]
    };

    /* ------------ CREATE BUTTON ------------ */
    const navContainer = document.createElement("div");
    navContainer.id = "user-nav-container";
    navContainer.style.position = "fixed";
    navContainer.style.bottom = "30px";
    navContainer.style.right = "30px";
    navContainer.style.zIndex = "9999";
    navContainer.style.cursor = "move";

    // Make container draggable
    navContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
        if (e.target === navContainer || e.target === navButton) {
            isDragging = true;
            const rect = navContainer.getBoundingClientRect();
            dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            navContainer.style.cursor = "grabbing";
        }
    }

    function drag(e) {
        if (!isDragging) return;
        navContainer.style.left = (e.clientX - dragOffset.x) + 'px';
        navContainer.style.top = (e.clientY - dragOffset.y) + 'px';
        navContainer.style.right = 'auto';
        navContainer.style.bottom = 'auto';
    }

    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            navContainer.style.cursor = "move";
        }
    }

    const navButton = document.createElement("button");
    navButton.innerText = "☰ User Navigation";
    navButton.style.padding = "10px 20px";
    navButton.style.borderRadius = "20px";
    navButton.style.border = "none";
    navButton.style.background = "#092365";
    navButton.style.color = "white";
    navButton.style.cursor = "pointer";
    navButton.style.fontSize = "16px";
    navButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";

    navContainer.appendChild(navButton);
    document.body.appendChild(navContainer);

    /* ------------ DROPDOWN MENU ------------ */
    const dropdown = document.createElement("div");
    dropdown.style.display = "none";
    dropdown.style.position = "absolute";
    dropdown.style.bottom = "50px";
    dropdown.style.right = "0";
    dropdown.style.background = "white";
    dropdown.style.border = "1px solid #ccc";
    dropdown.style.borderRadius = "8px";
    dropdown.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
    dropdown.style.minWidth = "200px";
    dropdown.style.overflow = "hidden";
    dropdown.style.zIndex = "10000";

    // Add options to dropdown as a table
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    navigationOptions.forEach(opt => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = opt.name;
        cell.style.padding = "12px 15px";
        cell.style.cursor = "pointer";
        cell.style.borderBottom = "1px solid #eee";
        cell.addEventListener("mouseenter", () => cell.style.background = "#f0f0f0");
        cell.addEventListener("mouseleave", () => cell.style.background = "white");
        cell.addEventListener("click", () => {
            dropdown.style.display = "none";
            startAutomation(opt);
        });
        row.appendChild(cell);
        table.appendChild(row);
    });

    dropdown.appendChild(table);
    navContainer.appendChild(dropdown);

    navButton.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
        hideBubbles();
    });

    /* ------------ FREQUENT OPTIONS AS SPEECH BUBBLES ------------ */
    frequentOptions.forEach((freq, i) => {
        const bubble = document.createElement("div");
        bubble.innerText = freq;
        bubble.style.position = "absolute";
        bubble.style.bottom = `${60 + (i * 45)}px`;
        bubble.style.right = "150px";
        bubble.style.background = "#ffeb3b";
        bubble.style.color = "black";
        bubble.style.padding = "8px 12px";
        bubble.style.borderRadius = "20px";
        bubble.style.fontSize = "13px";
        bubble.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        bubble.style.cursor = "pointer";
        bubble.style.opacity = "0";
        bubble.style.transition = "opacity 1s ease";
        bubble.style.whiteSpace = "nowrap";
        bubble.style.zIndex = "9998";

        bubble.addEventListener("click", () => {
            const opt = navigationOptions.find(o => o.name === freq);
            if (opt) startAutomation(opt);
        });

        navContainer.appendChild(bubble);
        bubbles.push(bubble);
    });

    function showBubbles() {
        bubbles.forEach((b, i) => {
            setTimeout(() => {
                b.style.opacity = "1";
                setTimeout(() => {
                    b.style.opacity = "0";
                }, BUBBLE_DISPLAY_TIME);
            }, i * 600);
        });
    }

    function hideBubbles() {
        bubbles.forEach(b => {
            b.style.opacity = "0";
        });
    }

    setTimeout(showBubbles, 1500);

    /* ------------ ELEMENT HIGHLIGHTING ------------ */
    function highlightElement(selector, message) {
        removeHighlights();
        const element = document.querySelector(selector);
        if (!element) return false;
        const highlight = document.createElement("div");
        highlight.className = "nav-highlight";
        highlight.style.position = "absolute";
        highlight.style.border = "3px solid #ff6b6b";
        highlight.style.borderRadius = "8px";
        highlight.style.pointerEvents = "none";
        highlight.style.zIndex = "9998";
        highlight.style.boxShadow = "0 0 20px rgba(255, 107, 107, 0.5)";
        highlight.style.animation = "pulse 2s infinite";
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        highlight.style.top = (rect.top + scrollTop - 5) + "px";
        highlight.style.left = (rect.left + scrollLeft - 5) + "px";
        highlight.style.width = (rect.width + 10) + "px";
        highlight.style.height = (rect.height + 10) + "px";
        document.body.appendChild(highlight);
        // Add pulse animation
        if (!document.getElementById("nav-pulse-style")) {
            const style = document.createElement("style");
            style.id = "nav-pulse-style";
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
    }

    function removeHighlights() {
        document.querySelectorAll(".nav-highlight").forEach(el => el.remove());
    }

    /* ------------ AUTOMATION SYSTEM ------------ */
    function startAutomation(option) {
        if (currentAutomation) {
            document.body.removeChild(currentAutomation);
            if (currentAutomationInterval) {
                clearInterval(currentAutomationInterval);
                currentAutomationInterval = null;
            }
        }
        let stepIndex = 0;
        removeHighlights();
        const guidePanel = document.createElement("div");
        guidePanel.id = "nav-guide-panel";
        guidePanel.style.position = "fixed";
        guidePanel.style.top = "20px";
        guidePanel.style.right = "20px";
        guidePanel.style.background = "white";
        guidePanel.style.borderRadius = "10px";
        guidePanel.style.padding = "15px";
        guidePanel.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
        guidePanel.style.zIndex = "10000";
        guidePanel.style.minWidth = "300px";
        guidePanel.style.maxWidth = "400px";
        guidePanel.style.cursor = "move";
        const title = document.createElement("h3");
        title.innerText = `${option.name} Guide`;
        title.style.margin = "0 0 10px 0";
        title.style.color = "#092365";
        title.style.fontSize = "16px";
        const message = document.createElement("div");
        message.style.fontSize = "14px";
        message.style.marginBottom = "15px";
        message.style.lineHeight = "1.4";
        const progressContainer = document.createElement("div");
        progressContainer.style.display = "flex";
        progressContainer.style.alignItems = "center";
        progressContainer.style.marginBottom = "15px";
        progressContainer.style.gap = "10px";
        const progressText = document.createElement("span");
        progressText.style.fontSize = "12px";
        progressText.style.color = "#666";
        const progressBar = document.createElement("div");
        progressBar.style.flexGrow = "1";
        progressBar.style.height = "6px";
        progressBar.style.background = "#eee";
        progressBar.style.borderRadius = "3px";
        progressBar.style.overflow = "hidden";
        const progress = document.createElement("div");
        progress.style.height = "100%";
        progress.style.background = "#092365";
        progress.style.borderRadius = "3px";
        progress.style.transition = "width 0.3s ease";
        progressBar.appendChild(progress);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "8px";
        buttonContainer.style.justifyContent = "space-between";
        const prevBtn = document.createElement("button");
        prevBtn.innerText = "← Previous";
        prevBtn.style.padding = "8px 12px";
        prevBtn.style.border = "1px solid #ccc";
        prevBtn.style.borderRadius = "4px";
        prevBtn.style.cursor = "pointer";
        prevBtn.style.fontSize = "12px";
        prevBtn.style.background = "white";
        prevBtn.disabled = true;
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "Next →";
        nextBtn.style.padding = "8px 12px";
        nextBtn.style.border = "none";
        nextBtn.style.borderRadius = "4px";
        nextBtn.style.cursor = "pointer";
        nextBtn.style.fontSize = "12px";
        nextBtn.style.background = "#4caf50";
        nextBtn.style.color = "white";
        const autoBtn = document.createElement("button");
        autoBtn.innerText = "Auto Run";
        autoBtn.style.padding = "8px 12px";
        autoBtn.style.border = "none";
        autoBtn.style.borderRadius = "4px";
        autoBtn.style.cursor = "pointer";
        autoBtn.style.fontSize = "12px";
        autoBtn.style.background = "#2196f3";
        autoBtn.style.color = "white";
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Close";
        closeBtn.style.padding = "8px 12px";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.fontSize = "12px";
        closeBtn.style.background = "#f44336";
        closeBtn.style.color = "white";
        buttonContainer.appendChild(prevBtn);
        buttonContainer.appendChild(nextBtn);
        buttonContainer.appendChild(autoBtn);
        buttonContainer.appendChild(closeBtn);
        guidePanel.appendChild(title);
        guidePanel.appendChild(message);
        guidePanel.appendChild(progressContainer);
        guidePanel.appendChild(buttonContainer);
        currentAutomation = guidePanel;
        function updateStep() {
            const currentStep = option.steps[stepIndex];
            message.innerHTML = `<strong>Step ${stepIndex + 1} of ${option.steps.length}:</strong><br>${currentStep}`;
            const progressPercent = ((stepIndex + 1) / option.steps.length) * 100;
            progress.style.width = progressPercent + "%";
            progressText.innerText = `${stepIndex + 1}/${option.steps.length}`;
            prevBtn.disabled = stepIndex === 0;
            nextBtn.innerText = stepIndex >= option.steps.length - 1 ? "Finish" : "Next →";
            nextBtn.style.background = stepIndex >= option.steps.length - 1 ? "#092365" : "#4caf50";
            highlightCurrentStep(option.name, stepIndex);
        }
        function highlightCurrentStep(optionName, step) {
            const selector = highlightSelectors[optionName][step];
            if (selector) {
                highlightElement(selector, option.steps[step]);
            }
        }
        function performStep() {
            const actions = automationActions[option.name];
            if (actions && actions[stepIndex]) {
                const success = actions[stepIndex]();
                if (!success) {
                    console.warn(`Step ${stepIndex + 1} failed: Element not found for ${option.name}`);
                }
            }
            if (stepIndex < option.steps.length - 1) {
                stepIndex++;
                updateStep();
            } else {
                setTimeout(() => {
                    removeHighlights();
                    document.body.removeChild(guidePanel);
                    currentAutomation = null;
                    clearInterval(currentAutomationInterval);
                    currentAutomationInterval = null;
                }, AUTOMATION_STEP_DELAY);
            }
        }
        function runAllSteps() {
            if (currentAutomationInterval) {
                clearInterval(currentAutomationInterval);
                currentAutomationInterval = null;
            }
            stepIndex = 0;
            updateStep();
            performStep();
            currentAutomationInterval = setInterval(() => {
                performStep();
            }, AUTOMATION_STEP_DELAY);
        }
        updateStep();
        prevBtn.addEventListener("click", () => {
            if (stepIndex > 0) {
                stepIndex--;
                updateStep();
            }
        });
        nextBtn.addEventListener("click", () => {
            if (stepIndex < option.steps.length - 1) {
                stepIndex++;
                updateStep();
                const actions = automationActions[option.name];
                if (actions && actions[stepIndex]) {
                    actions[stepIndex]();
                }
            } else {
                removeHighlights();
                document.body.removeChild(guidePanel);
                currentAutomation = null;
            }
        });
        autoBtn.addEventListener("click", () => {
            autoBtn.innerText = "Running...";
            autoBtn.disabled = true;
            runAllSteps();
        });
        closeBtn.addEventListener("click", () => {
            removeHighlights();
            if (currentAutomationInterval) {
                clearInterval(currentAutomationInterval);
                currentAutomationInterval = null;
            }
            document.body.removeChild(guidePanel);
            currentAutomation = null;
            autoBtn.innerText = "Auto Run";
            autoBtn.disabled = false;
        });
        document.body.appendChild(guidePanel);
        let isPanelDragging = false;
        let panelDragOffset = { x: 0, y: 0 };
        function startDragPanel(e) {
            if (e.target.tagName !== 'BUTTON') {
                isPanelDragging = true;
                const rect = guidePanel.getBoundingClientRect();
                panelDragOffset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                guidePanel.style.cursor = "grabbing";
            }
        }
        function dragPanel(e) {
            if (!isPanelDragging) return;
            guidePanel.style.left = (e.clientX - panelDragOffset.x) + 'px';
            guidePanel.style.top = (e.clientY - panelDragOffset.y) + 'px';
            guidePanel.style.right = 'auto';
        }
        function stopDragPanel() {
            isPanelDragging = false;
            guidePanel.style.cursor = "move";
        }
        guidePanel.addEventListener('mousedown', startDragPanel);
        document.addEventListener('mousemove', dragPanel);
        document.addEventListener('mouseup', stopDragPanel);
    }
    // Clean up highlights when page changes
    const observer = new MutationObserver(() => {
        if (currentAutomation) {
            setTimeout(() => {
                const progressText = currentAutomation.querySelector("span");
                if (progressText) {
                    const [current, total] = progressText.innerText.split('/').map(Number);
                    if (current > 0) {
                        const optionName = currentAutomation.querySelector("h3").innerText.replace(" Guide", "");
                        highlightCurrentStep(optionName, current - 1);
                    }
                }
            }, 100);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && currentAutomation) {
            removeHighlights();
            if (currentAutomationInterval) {
                clearInterval(currentAutomationInterval);
                currentAutomationInterval = null;
            }
            document.body.removeChild(currentAutomation);
            currentAutomation = null;
            const autoBtn = document.querySelector("#nav-guide-panel button:nth-child(3)");
            if (autoBtn) {
                autoBtn.innerText = "Auto Run";
                autoBtn.disabled = false;
            }
        }
    });
});