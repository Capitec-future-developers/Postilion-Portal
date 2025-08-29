document.addEventListener("DOMContentLoaded", () => {
// Configuration
    const AUTOMATION_STEP_DELAY = 2000; // 2 seconds between steps
    const BUBBLE_DISPLAY_TIME = 12000;
    const EDIT_PASSWORD = "Genesis@2025!!"; // Password for editing use cases

// Navigation options based on app features
    let navigationOptions = [
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

// Load saved options if available
    const savedOptions = localStorage.getItem('userNavOptions');
    if (savedOptions) {
        navigationOptions = JSON.parse(savedOptions);
    }

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

// Add Edit Use Cases option
    const editRow = document.createElement("tr");
    const editCell = document.createElement("td");
    editCell.textContent = "Edit Use Cases (Admin)";
    editCell.style.padding = "12px 15px";
    editCell.style.cursor = "pointer";
    editCell.style.borderBottom = "1px solid #eee";
    editCell.style.fontWeight = "bold";
    editCell.style.color = "#d32f2f";
    editCell.addEventListener("mouseenter", () => editCell.style.background = "#ffebee");
    editCell.addEventListener("mouseleave", () => editCell.style.background = "white");
    editCell.addEventListener("click", () => {
        dropdown.style.display = "none";
        showPasswordDialog();
    });
    editRow.appendChild(editCell);
    table.appendChild(editRow);

// Add navigation options
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

    /* ------------ PASSWORD DIALOG ------------ */
    function showPasswordDialog() {
        const dialog = document.createElement("div");
        dialog.style.position = "fixed";
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.transform = "translate(-50%, -50%)";
        dialog.style.background = "white";
        dialog.style.padding = "20px";
        dialog.style.borderRadius = "10px";
        dialog.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
        dialog.style.zIndex = "10001";
        dialog.style.minWidth = "300px";

        const title = document.createElement("h3");
        title.textContent = "Admin Access Required";
        title.style.margin = "0 0 15px 0";
        title.style.color = "#092365";

        const instruction = document.createElement("p");
        instruction.textContent = "Please enter the admin password to edit use cases:";
        instruction.style.margin = "0 0 10px 0";
        instruction.style.fontSize = "14px";

        const passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.style.width = "100%";
        passwordInput.style.padding = "10px";
        passwordInput.style.margin = "0 0 15px 0";
        passwordInput.style.border = "1px solid #ccc";
        passwordInput.style.borderRadius = "4px";
        passwordInput.style.boxSizing = "border-box";

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "flex-end";
        buttonContainer.style.gap = "10px";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.padding = "8px 15px";
        cancelBtn.style.border = "1px solid #ccc";
        cancelBtn.style.borderRadius = "4px";
        cancelBtn.style.background = "white";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.addEventListener("click", () => document.body.removeChild(dialog));

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";
        submitBtn.style.padding = "8px 15px";
        submitBtn.style.border = "none";
        submitBtn.style.borderRadius = "4px";
        submitBtn.style.background = "#092365";
        submitBtn.style.color = "white";
        submitBtn.style.cursor = "pointer";
        submitBtn.addEventListener("click", () => {
            if (passwordInput.value === EDIT_PASSWORD) {
                document.body.removeChild(dialog);
                showEditUseCasesDialog();
            } else {
                alert("Incorrect password. Please try again.");
                passwordInput.value = "";
            }
        });

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(submitBtn);

        dialog.appendChild(title);
        dialog.appendChild(instruction);
        dialog.appendChild(passwordInput);
        dialog.appendChild(buttonContainer);

// Allow submitting with Enter key
        passwordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                submitBtn.click();
            }
        });

        document.body.appendChild(dialog);
        passwordInput.focus();
    }

    /* ------------ EDIT USE CASES DIALOG ------------ */
    function showEditUseCasesDialog() {
        const dialog = document.createElement("div");
        dialog.style.position = "fixed";
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.transform = "translate(-50%, -50%)";
        dialog.style.background = "white";
        dialog.style.padding = "20px";
        dialog.style.borderRadius = "10px";
        dialog.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
        dialog.style.zIndex = "10001";
        dialog.style.minWidth = "500px";
        dialog.style.maxWidth = "90%";
        dialog.style.maxHeight = "80vh";
        dialog.style.overflowY = "auto";

        const title = document.createElement("h3");
        title.textContent = "Edit Navigation Use Cases";
        title.style.margin = "0 0 15px 0";
        title.style.color = "#092365";

        const instructions = document.createElement("p");
        instructions.textContent = "Edit the steps for each use case. Each step should be on a new line.";
        instructions.style.margin = "0 0 15px 0";
        instructions.style.fontSize = "14px";

        const useCasesContainer = document.createElement("div");
        useCasesContainer.style.marginBottom = "20px";

// Create editors for each use case
        navigationOptions.forEach((option, index) => {
            createUseCaseEditor(useCasesContainer, option, index);
        });

// Add New Use Case button
        const addButtonContainer = document.createElement("div");
        addButtonContainer.style.marginBottom = "20px";
        addButtonContainer.style.textAlign = "center";

        const addButton = document.createElement("button");
        addButton.textContent = "+ Add New Use Case";
        addButton.style.padding = "10px 15px";
        addButton.style.border = "1px dashed #092365";
        addButton.style.borderRadius = "4px";
        addButton.style.background = "transparent";
        addButton.style.color = "#092365";
        addButton.style.cursor = "pointer";
        addButton.style.fontSize = "14px";
        addButton.style.width = "100%";
        addButton.addEventListener("mouseenter", () => {
            addButton.style.background = "#f0f4ff";
        });
        addButton.addEventListener("mouseleave", () => {
            addButton.style.background = "transparent";
        });
        addButton.addEventListener("click", () => {
            const newUseCase = {
                name: "New Use Case",
                steps: ["Step 1", "Step 2", "Step 3"]
            };
            createUseCaseEditor(useCasesContainer, newUseCase, navigationOptions.length);
            navigationOptions.push(newUseCase);
        });

        addButtonContainer.appendChild(addButton);
        useCasesContainer.appendChild(addButtonContainer);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "flex-end";
        buttonContainer.style.gap = "10px";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.padding = "8px 15px";
        cancelBtn.style.border = "1px solid #ccc";
        cancelBtn.style.borderRadius = "4px";
        cancelBtn.style.background = "white";
        cancelBtn.style.cursor = "pointer";
        cancelBtn.addEventListener("click", () => document.body.removeChild(dialog));

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Changes";
        saveBtn.style.padding = "8px 15px";
        saveBtn.style.border = "none";
        saveBtn.style.borderRadius = "4px";
        saveBtn.style.background = "#4caf50";
        saveBtn.style.color = "white";
        saveBtn.style.cursor = "pointer";
        saveBtn.addEventListener("click", () => {
// Collect all use case data
            const useCaseEditors = useCasesContainer.querySelectorAll('.use-case-editor');
            const updatedOptions = [];

            useCaseEditors.forEach(editor => {
                const nameInput = editor.querySelector('input[type="text"]');
                const stepsTextarea = editor.querySelector('textarea');

// Parse steps from textarea (one per line)
                const steps = stepsTextarea.value.split('\n')
                    .map(step => step.trim())
                    .filter(step => step.length > 0);

                updatedOptions.push({
                    name: nameInput.value,
                    steps: steps
                });
            });

// Update navigation options
            navigationOptions = updatedOptions;

// Save to localStorage
            localStorage.setItem('userNavOptions', JSON.stringify(navigationOptions));

            document.body.removeChild(dialog);

// Show confirmation
            alert("Use cases updated successfully!");
        });

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(saveBtn);

        dialog.appendChild(title);
        dialog.appendChild(instructions);
        dialog.appendChild(useCasesContainer);
        dialog.appendChild(buttonContainer);

        document.body.appendChild(dialog);
    }

// Helper function to create a use case editor
    function createUseCaseEditor(container, option, index) {
        const useCaseDiv = document.createElement("div");
        useCaseDiv.className = "use-case-editor";
        useCaseDiv.style.marginBottom = "20px";
        useCaseDiv.style.padding = "15px";
        useCaseDiv.style.border = "1px solid #e0e0e0";
        useCaseDiv.style.borderRadius = "8px";
        useCaseDiv.style.backgroundColor = "#f9f9f9";

// Header with title and delete button
        const headerDiv = document.createElement("div");
        headerDiv.style.display = "flex";
        headerDiv.style.justifyContent = "space-between";
        headerDiv.style.alignItems = "center";
        headerDiv.style.marginBottom = "10px";

        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Use Case Name:";
        nameLabel.style.fontWeight = "bold";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "× Delete";
        deleteButton.style.padding = "4px 8px";
        deleteButton.style.border = "1px solid #f44336";
        deleteButton.style.borderRadius = "4px";
        deleteButton.style.background = "transparent";
        deleteButton.style.color = "#f44336";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.fontSize = "12px";
        deleteButton.addEventListener("mouseenter", () => {
            deleteButton.style.background = "#ffebee";
        });
        deleteButton.addEventListener("mouseleave", () => {
            deleteButton.style.background = "transparent";
        });
        deleteButton.addEventListener("click", () => {
            if (navigationOptions.length > 1) {
                if (confirm("Are you sure you want to delete this use case?")) {
                    container.removeChild(useCaseDiv);
                    navigationOptions.splice(index, 1);
                }
            } else {
                alert("You need to have at least one use case.");
            }
        });

        headerDiv.appendChild(nameLabel);
        headerDiv.appendChild(deleteButton);

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = option.name;
        nameInput.style.width = "100%";
        nameInput.style.padding = "8px";
        nameInput.style.marginBottom = "10px";
        nameInput.style.border = "1px solid #ccc";
        nameInput.style.borderRadius = "4px";
        nameInput.style.boxSizing = "border-box";

        const stepsLabel = document.createElement("label");
        stepsLabel.textContent = "Steps (one per line):";
        stepsLabel.style.display = "block";
        stepsLabel.style.marginBottom = "5px";
        stepsLabel.style.fontWeight = "bold";

        const stepsTextarea = document.createElement("textarea");
        stepsTextarea.value = option.steps.join('\n');
        stepsTextarea.style.width = "100%";
        stepsTextarea.style.height = "120px";
        stepsTextarea.style.padding = "8px";
        stepsTextarea.style.border = "1px solid #ccc";
        stepsTextarea.style.borderRadius = "4px";
        stepsTextarea.style.boxSizing = "border-box";
        stepsTextarea.style.resize = "vertical";

        useCaseDiv.appendChild(headerDiv);
        useCaseDiv.appendChild(nameInput);
        useCaseDiv.appendChild(stepsLabel);
        useCaseDiv.appendChild(stepsTextarea);
        container.appendChild(useCaseDiv);
    }

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
        nextBtn.style.background = "#4caf51";
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
            const selector = highlightSelectors[optionName] && highlightSelectors[optionName][step];
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
