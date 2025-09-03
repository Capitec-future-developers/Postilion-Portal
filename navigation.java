import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.util.*;
import java.util.List;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class UserNavigationApp extends JFrame {
    private static final int AUTOMATION_STEP_DELAY = 2000; // 2 seconds between steps
    private static final int BUBBLE_DISPLAY_TIME = 12000;
    private static final String EDIT_PASSWORD = "Genesis@2025!!";
    private List<NavigationOption> navigationOptions;
    private List<JLabel> bubbles = new ArrayList<>();
    private JPanel navContainer;
    private JPopupMenu dropdown;
    private JPanel currentAutomationPanel;
    private Timer currentAutomationTimer;
    private boolean isDragging = false;
    private Point dragOffset = new Point(0, 0);
    private final String[] frequentOptions = {"Cards Navigation", "Customers Navigation", "Transactions Navigation"};
    private final Gson gson = new Gson();

    // Simulated automation actions
    private final Map<String, List<Runnable>> automationActions = new HashMap<>();
    private final Map<String, List<String>> highlightSelectors = new HashMap<>();

    public UserNavigationApp() {
        setTitle("User Navigation App");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(null); // Absolute positioning for drag functionality

        // Initialize navigation options
        initializeNavigationOptions();
        loadSavedOptions();

        // Initialize automation actions (simulated)
        initializeAutomationActions();

        // Create navigation button container
        navContainer = new JPanel();
        navContainer.setBounds(730, 530, 150, 40); // Bottom-right corner
        navContainer.setOpaque(false);
        navContainer.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                if (e.getSource() == navContainer || e.getSource() == navContainer.getComponent(0)) {
                    isDragging = true;
                    dragOffset = new Point(e.getX(), e.getY());
                    navContainer.setCursor(Cursor.getPredefinedCursor(Cursor.MOVE_CURSOR));
                }
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                isDragging = false;
                navContainer.setCursor(Cursor.getDefaultCursor());
            }
        });
        navContainer.addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseDragged(MouseEvent e) {
                if (isDragging) {
                    Point p = SwingUtilities.convertPoint(navContainer, e.getPoint(), getContentPane());
                    navContainer.setLocation(p.x - dragOffset.x, p.y - dragOffset.y);
                }
            }
        });

        // Create navigation button
        JButton navButton = new JButton("☰ User Navigation");
        navButton.setBackground(new Color(9, 35, 101));
        navButton.setForeground(Color.WHITE);
        navButton.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));
        navButton.setFont(new Font("Arial", Font.PLAIN, 16));
        navButton.setFocusPainted(false);
        navContainer.add(navButton);
        getContentPane().add(navContainer);

        // Create dropdown menu
        dropdown = new JPopupMenu();
        createDropdownMenu();

        // Add button action
        navButton.addActionListener(e -> {
            if (dropdown.isVisible()) {
                dropdown.setVisible(false);
                hideBubbles();
            } else {
                dropdown.show(navContainer, 0, -dropdown.getPreferredSize().height);
                showBubbles();
            }
        });

        // Create frequent option bubbles
        createBubbles();

        // Handle ESC key to close automation
        getRootPane().registerKeyboardAction(e -> {
            if (currentAutomationPanel != null) {
                stopAutomation();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ESCAPE, 0), JComponent.WHEN_IN_FOCUSED_WINDOW);

        setVisible(true);
    }

    private void initializeNavigationOptions() {
        navigationOptions = new ArrayList<>();
        navigationOptions.add(new NavigationOption("Cards Navigation", Arrays.asList(
                "Click on Cards in the sidebar",
                "Enter card details in search fields",
                "Click Search to find cards",
                "Click on a card number to view inquiry",
                "Explore tabs like Transactions"
        )));
        navigationOptions.add(new NavigationOption("Customers Navigation", Arrays.asList(
                "Click on Customers in the sidebar",
                "View the list of customers",
                "Check customer details in the table"
        )));
        navigationOptions.add(new NavigationOption("Transactions Navigation", Arrays.asList(
                "Click on Transactions in the sidebar",
                "View the list of transactions",
                "Check transaction details in the table"
        )));
    }

    private void loadSavedOptions() {
        File file = new File("userNavOptions.json");
        if (file.exists()) {
            try (FileReader reader = new FileReader(file)) {
                navigationOptions = gson.fromJson(reader, new TypeToken<List<NavigationOption>>(){}.getType());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void saveOptions() {
        try (FileWriter writer = new FileWriter("userNavOptions.json")) {
            gson.toJson(navigationOptions, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void initializeAutomationActions() {
        automationActions.put("Cards Navigation", Arrays.asList(
                () -> System.out.println("Simulating click on Cards"),
                () -> System.out.println("Simulating entering card number: 4016000011163734"),
                () -> System.out.println("Simulating click on Search"),
                () -> System.out.println("Simulating click on card link"),
                () -> System.out.println("Simulating click on Transactions tab")
        ));
        automationActions.put("Customers Navigation", Arrays.asList(
                () -> System.out.println("Simulating click on Customers"),
                () -> System.out.println("Viewing customers list"),
                () -> System.out.println("Checking customer details")
        ));
        automationActions.put("Transactions Navigation", Arrays.asList(
                () -> System.out.println("Simulating click on Transactions"),
                () -> System.out.println("Viewing transactions list"),
                () -> System.out.println("Checking transaction details")
        ));

        // Simulated selectors for highlighting (using component names in a real app)
        highlightSelectors.put("Cards Navigation", Arrays.asList("cards", "cardNumber", "search", "cardLink", "transactionsTab"));
        highlightSelectors.put("Customers Navigation", Arrays.asList("customers", "customersTable", "customerRow"));
        highlightSelectors.put("Transactions Navigation", Arrays.asList("transactions", "transactionsTable", "transactionRow"));
    }

    private void createDropdownMenu() {
        dropdown.removeAll();
        JMenuItem editItem = new JMenuItem("Edit Use Cases (Admin)");
        editItem.setForeground(new Color(211, 47, 47));
        editItem.setFont(editItem.getFont().deriveFont(Font.BOLD));
        editItem.addActionListener(e -> showPasswordDialog());
        dropdown.add(editItem);
        dropdown.addSeparator();

        for (NavigationOption opt : navigationOptions) {
            JMenuItem item = new JMenuItem(opt.name);
            item.addActionListener(e -> startAutomation(opt));
            dropdown.add(item);
        }
    }

    private void createBubbles() {
        for (int i = 0; i < frequentOptions.length; i++) {
            JLabel bubble = new JLabel(frequentOptions[i]);
            bubble.setOpaque(true);
            bubble.setBackground(new Color(255, 235, 59));
            bubble.setForeground(Color.BLACK);
            bubble.setBorder(BorderFactory.createEmptyBorder(8, 12, 8, 12));
            bubble.setFont(new Font("Arial", Font.PLAIN, 13));
            bubble.setBounds(580, 470 - (i * 45), 150, 30);
            bubble.setVisible(false);
            bubble.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    NavigationOption opt = navigationOptions.stream()
                            .filter(o -> o.name.equals(bubble.getText()))
                            .findFirst().orElse(null);
                    if (opt != null) startAutomation(opt);
                }
            });
            getContentPane().add(bubble);
            bubbles.add(bubble);
        }

        // Show bubbles with delay
        Timer bubbleTimer = new Timer(1500, e -> showBubbles());
        bubbleTimer.setRepeats(false);
        bubbleTimer.start();
    }

    private void showBubbles() {
        for (int i = 0; i < bubbles.size(); i++) {
            JLabel bubble = bubbles.get(i);
            Timer showTimer = new Timer(i * 600, e -> {
                bubble.setVisible(true);
                Timer hideTimer = new Timer(BUBBLE_DISPLAY_TIME, ev -> bubble.setVisible(false));
                hideTimer.setRepeats(false);
                hideTimer.start();
            });
            showTimer.setRepeats(false);
            showTimer.start();
        }
    }

    private void hideBubbles() {
        bubbles.forEach(b -> b.setVisible(false));
    }

    private void showPasswordDialog() {
        JDialog dialog = new JDialog(this, "Admin Access Required", true);
        dialog.setLayout(new BorderLayout(10, 10));
        dialog.setSize(300, 200);
        dialog.setLocationRelativeTo(this);

        JLabel title = new JLabel("Admin Access Required");
        title.setFont(new Font("Arial", Font.BOLD, 16));
        title.setForeground(new Color(9, 35, 101));
        dialog.add(title, BorderLayout.NORTH);

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        JLabel instruction = new JLabel("Please enter the admin password:");
        JPasswordField passwordField = new JPasswordField();
        centerPanel.add(instruction, BorderLayout.NORTH);
        centerPanel.add(passwordField, BorderLayout.CENTER);
        dialog.add(centerPanel, BorderLayout.CENTER);

        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        JButton cancelBtn = new JButton("Cancel");
        cancelBtn.addActionListener(e -> dialog.dispose());
        JButton submitBtn = new JButton("Submit");
        submitBtn.addActionListener(e -> {
            if (new String(passwordField.getPassword()).equals(EDIT_PASSWORD)) {
                dialog.dispose();
                showEditUseCasesDialog();
            } else {
                JOptionPane.showMessageDialog(dialog, "Incorrect password. Please try again.");
                passwordField.setText("");
            }
        });
        buttonPanel.add(cancelBtn);
        buttonPanel.add(submitBtn);
        dialog.add(buttonPanel, BorderLayout.SOUTH);

        passwordField.addActionListener(e -> submitBtn.doClick());
        dialog.setVisible(true);
        passwordField.requestFocus();
    }

    private void showEditUseCasesDialog() {
        JDialog dialog = new JDialog(this, "Edit Navigation Use Cases", true);
        dialog.setLayout(new BorderLayout(10, 10));
        dialog.setSize(500, 600);
        dialog.setLocationRelativeTo(this);

        JLabel title = new JLabel("Edit Navigation Use Cases");
        title.setFont(new Font("Arial", Font.BOLD, 16));
        title.setForeground(new Color(9, 35, 101));
        dialog.add(title, BorderLayout.NORTH);

        JPanel useCasesPanel = new JPanel();
        useCasesPanel.setLayout(new BoxLayout(useCasesPanel, BoxLayout.Y_AXIS));
        JScrollPane scrollPane = new JScrollPane(useCasesPanel);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        List<JPanel> useCaseEditors = new ArrayList<>();
        for (int i = 0; i < navigationOptions.size(); i++) {
            useCaseEditors.add(createUseCaseEditor(navigationOptions.get(i), i, useCasesPanel));
        }

        JPanel addButtonPanel = new JPanel(new BorderLayout());
        JButton addButton = new JButton("+ Add New Use Case");
        addButton.setBorder(BorderFactory.createDashedBorder(new Color(9, 35, 101)));
        addButton.setBackground(Color.WHITE);
        addButton.setForeground(new Color(9, 35, 101));
        addButton.addActionListener(e -> {
            NavigationOption newOption = new NavigationOption("New Use Case", Arrays.asList("Step 1", "Step 2", "Step 3"));
            navigationOptions.add(newOption);
            useCaseEditors.add(createUseCaseEditor(newOption, navigationOptions.size() - 1, useCasesPanel));
            useCasesPanel.revalidate();
            scrollPane.getVerticalScrollBar().setValue(scrollPane.getVerticalScrollBar().getMaximum());
        });
        addButtonPanel.add(addButton, BorderLayout.CENTER);
        useCasesPanel.add(addButtonPanel);

        dialog.add(scrollPane, BorderLayout.CENTER);

        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        JButton cancelBtn = new JButton("Cancel");
        cancelBtn.addActionListener(e -> dialog.dispose());
        JButton saveBtn = new JButton("Save Changes");
        saveBtn.setBackground(new Color(76, 175, 80));
        saveBtn.setForeground(Color.WHITE);
        saveBtn.addActionListener(e -> {
            List<NavigationOption> updatedOptions = new ArrayList<>();
            for (JPanel editor : useCaseEditors) {
                JTextField nameField = (JTextField) editor.getComponent(1);
                JTextArea stepsArea = (JTextArea) editor.getComponent(3);
                String[] steps = stepsArea.getText().split("\n");
                List<String> stepList = new ArrayList<>();
                for (String step : steps) {
                    if (!step.trim().isEmpty()) stepList.add(step.trim());
                }
                updatedOptions.add(new NavigationOption(nameField.getText(), stepList));
            }
            navigationOptions = updatedOptions;
            saveOptions();
            createDropdownMenu();
            dialog.dispose();
            JOptionPane.showMessageDialog(this, "Use cases updated successfully!");
        });
        buttonPanel.add(cancelBtn);
        buttonPanel.add(saveBtn);
        dialog.add(buttonPanel, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }

    private JPanel createUseCaseEditor(NavigationOption option, int index, JPanel container) {
        JPanel editor = new JPanel();
        editor.setLayout(new BoxLayout(editor, BoxLayout.Y_AXIS));
        editor.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(224, 224, 224)),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));
        editor.setBackground(new Color(249, 249, 249));

        JPanel header = new JPanel(new BorderLayout());
        JLabel nameLabel = new JLabel("Use Case Name:");
        nameLabel.setFont(nameLabel.getFont().deriveFont(Font.BOLD));
        JButton deleteButton = new JButton("× Delete");
        deleteButton.setBorder(BorderFactory.createLineBorder(new Color(244, 67, 54)));
        deleteButton.setBackground(Color.WHITE);
        deleteButton.setForeground(new Color(244, 67, 54));
        deleteButton.setFont(new Font("Arial", Font.PLAIN, 12));
        deleteButton.addActionListener(e -> {
            if (navigationOptions.size() > 1) {
                if (JOptionPane.showConfirmDialog(this, "Are you sure you want to delete this use case?", "Confirm Delete", JOptionPane.YES_NO_OPTION) == JOptionPane.YES_OPTION) {
                    container.remove(editor);
                    navigationOptions.remove(index);
                    container.revalidate();
                    container.repaint();
                }
            } else {
                JOptionPane.showMessageDialog(this, "You need to have at least one use case.");
            }
        });
        header.add(nameLabel, BorderLayout.WEST);
        header.add(deleteButton, BorderLayout.EAST);

        JTextField nameField = new JTextField(option.name);
        nameField.setBorder(BorderFactory.createLineBorder(new Color(204, 204, 204)));
        JLabel stepsLabel = new JLabel("Steps (one per line):");
        stepsLabel.setFont(stepsLabel.getFont().deriveFont(Font.BOLD));
        JTextArea stepsArea = new JTextArea(String.join("\n", option.steps));
        stepsArea.setBorder(BorderFactory.createLineBorder(new Color(204, 204, 204)));
        stepsArea.setRows(5);

        editor.add(header);
        editor.add(Box.createVerticalStrut(5));
        editor.add(nameField);
        editor.add(Box.createVerticalStrut(5));
        editor.add(stepsLabel);
        editor.add(Box.createVerticalStrut(5));
        editor.add(new JScrollPane(stepsArea));
        editor.add(Box.createVerticalStrut(10));

        container.add(editor);
        container.add(Box.createVerticalStrut(10));
        return editor;
    }

    private void startAutomation(NavigationOption option) {
        if (currentAutomationPanel != null) {
            stopAutomation();
        }
        currentAutomationPanel = new JPanel();
        currentAutomationPanel.setLayout(new BorderLayout(10, 10));
        currentAutomationPanel.setBounds(20, 20, 300, 200);
        currentAutomationPanel.setBackground(Color.WHITE);
        currentAutomationPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(Color.BLACK),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));

        JLabel title = new JLabel(option.name + " Guide");
        title.setFont(new Font("Arial", Font.BOLD, 16));
        title.setForeground(new Color(9, 35, 101));
        currentAutomationPanel.add(title, BorderLayout.NORTH);

        JLabel message = new JLabel();
        message.setFont(new Font("Arial", Font.PLAIN, 14));
        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.add(message, BorderLayout.CENTER);
        currentAutomationPanel.add(centerPanel, BorderLayout.CENTER);

        JPanel progressPanel = new JPanel(new BorderLayout(10, 0));
        JLabel progressText = new JLabel();
        progressText.setFont(new Font("Arial", Font.PLAIN, 12));
        progressText.setForeground(new Color(102, 102, 102));
        JProgressBar progressBar = new JProgressBar(0, 100);
        progressBar.setBackground(new Color(238, 238, 238));
        progressBar.setForeground(new Color(9, 35, 101));
        progressPanel.add(progressText, BorderLayout.WEST);
        progressPanel.add(progressBar, BorderLayout.CENTER);
        centerPanel.add(progressPanel, BorderLayout.SOUTH);

        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        JButton prevBtn = new JButton("← Previous");
        prevBtn.setBorder(BorderFactory.createLineBorder(new Color(204, 204, 204)));
        prevBtn.setBackground(Color.WHITE);
        JButton nextBtn = new JButton("Next →");
        nextBtn.setBackground(new Color(76, 175, 80));
        nextBtn.setForeground(Color.WHITE);
        JButton autoBtn = new JButton("Auto Run");
        autoBtn.setBackground(new Color(33, 150, 243));
        autoBtn.setForeground(Color.WHITE);
        JButton closeBtn = new JButton("Close");
        closeBtn.setBackground(new Color(244, 67, 54));
        closeBtn.setForeground(Color.WHITE);
        buttonPanel.add(prevBtn);
        buttonPanel.add(nextBtn);
        buttonPanel.add(autoBtn);
        buttonPanel.add(closeBtn);
        currentAutomationPanel.add(buttonPanel, BorderLayout.SOUTH);

        final int[] stepIndex = {0};
        Runnable updateStep = () -> {
            message.setText("<html><b>Step " + (stepIndex[0] + 1) + " of " + option.steps.size() + ":</b><br>" + option.steps.get(stepIndex[0]) + "</html>");
            int progressPercent = ((stepIndex[0] + 1) * 100) / option.steps.size();
            progressBar.setValue(progressPercent);
            progressText.setText((stepIndex[0] + 1) + "/" + option.steps.size());
            prevBtn.setEnabled(stepIndex[0] > 0);
            nextBtn.setText(stepIndex[0] >= option.steps.size() - 1 ? "Finish" : "Next →");
            nextBtn.setBackground(stepIndex[0] >= option.steps.size() - 1 ? new Color(9, 35, 101) : new Color(76, 175, 80));
            highlightCurrentStep(option.name, stepIndex[0]);
        };

        Runnable performStep = () -> {
            List<Runnable> actions = automationActions.get(option.name);
            if (actions != null && stepIndex[0] < actions.size()) {
                actions.get(stepIndex[0]).run();
            }
            if (stepIndex[0] < option.steps.size() - 1) {
                stepIndex[0]++;
                updateStep.run();
            } else {
                stopAutomation();
            }
        };

        prevBtn.addActionListener(e -> {
            if (stepIndex[0] > 0) {
                stepIndex[0]--;
                updateStep.run();
            }
        });

        nextBtn.addActionListener(e -> {
            if (stepIndex[0] < option.steps.size() - 1) {
                stepIndex[0]++;
                updateStep.run();
                List<Runnable> actions = automationActions.get(option.name);
                if (actions != null && stepIndex[0] < actions.size()) {
                    actions.get(stepIndex[0]).run();
                }
            } else {
                stopAutomation();
            }
        });

        autoBtn.addActionListener(e -> {
            autoBtn.setText("Running...");
            autoBtn.setEnabled(false);
            stepIndex[0] = 0;
            updateStep.run();
            performStep.run();
            currentAutomationTimer = new Timer(AUTOMATION_STEP_DELAY, ev -> performStep.run());
            currentAutomationTimer.start();
        });

        closeBtn.addActionListener(e -> stopAutomation());

        // Make automation panel draggable
        final Point[] panelDragOffset = {new Point(0, 0)};
        currentAutomationPanel.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                if (!(e.getSource() instanceof JButton)) {
                    panelDragOffset[0] = new Point(e.getX(), e.getY());
                    currentAutomationPanel.setCursor(Cursor.getPredefinedCursor(Cursor.MOVE_CURSOR));
                }
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                currentAutomationPanel.setCursor(Cursor.getDefaultCursor());
            }
        });
        currentAutomationPanel.addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseDragged(MouseEvent e) {
                Point p = SwingUtilities.convertPoint(currentAutomationPanel, e.getPoint(), getContentPane());
                currentAutomationPanel.setLocation(p.x - panelDragOffset[0].x, p.y - panelDragOffset[0].y);
            }
        });

        updateStep.run();
        getContentPane().add(currentAutomationPanel);
        revalidate();
        repaint();
    }

    private void highlightCurrentStep(String optionName, int step) {
        // Simulated highlighting (in a real app, highlight UI components)
        String selector = highlightSelectors.getOrDefault(optionName, Collections.emptyList()).get(step);
        System.out.println("Highlighting: " + selector);
        // In a real app, you would apply a border or effect to the component
    }

    private void stopAutomation() {
        if (currentAutomationTimer != null) {
            currentAutomationTimer.stop();
            currentAutomationTimer = null;
        }
        if (currentAutomationPanel != null) {
            getContentPane().remove(currentAutomationPanel);
            currentAutomationPanel = null;
            revalidate();
            repaint();
        }
        JButton autoBtn = (JButton) currentAutomationPanel.getComponent(2).getComponent(2); // Auto button
        if (autoBtn != null) {
            autoBtn.setText("Auto Run");
            autoBtn.setEnabled(true);
        }
    }

    static class NavigationOption {
        String name;
        List<String> steps;

        NavigationOption(String name, List<String> steps) {
            this.name = name;
            this.steps = steps;
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(UserNavigationApp::new);
    }
}