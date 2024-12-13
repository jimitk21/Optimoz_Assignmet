let expenses = [];
let monthlyBudget = 0;

function addExpense(event) {
    event.preventDefault();

    const date = document.getElementById('expenseDate').value;
    const category = document.getElementById('expenseCategory').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const description = document.getElementById('expenseDescription').value;

    const expense = { date, category, amount, description };
    expenses.push(expense);
    event.target.reset();

    updateBudgetStatus();
    alert('Expense added successfully!');
    returnToMainMenu();
}

function viewExpenses() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '<h2>Expense List</h2>';

    if (expenses.length === 0) {
        expenseList.innerHTML += '<p>No expenses recorded.</p>';
    } else {
        expenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            expenseItem.innerHTML = `
                <p><strong>Date:</strong> ${expense.date}</p>
                <p class="category"><strong>Category:</strong> ${expense.category}</p>
                <p><strong>Amount:</strong> $${expense.amount.toFixed(2)}</p>
                <p><strong>Description:</strong> ${expense.description}</p>
            `;
            expenseList.appendChild(expenseItem);
        });
    }
    expenseList.innerHTML += `<button class="btn btn-secondary" onclick="returnToMainMenu()">Back to Menu</button>`;
}

function setBudget() {
    const budgetInput = document.getElementById('monthlyBudget');
    monthlyBudget = parseFloat(budgetInput.value);

    if (monthlyBudget > 0) {
        updateBudgetStatus();
        alert('Monthly budget set successfully!');
        returnToMainMenu();
    } else {
        alert('Please enter a valid budget amount.');
    }
}

function updateBudgetStatus() {
    const budgetStatus = document.getElementById('budgetStatus');
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

    if (monthlyBudget > 0) {
        const remainingBalance = monthlyBudget - totalExpenses;
        budgetStatus.innerHTML = totalExpenses > monthlyBudget
            ? `<p class="warning">🚨 Budget Exceeded! Overspent by: $${Math.abs(remainingBalance).toFixed(2)}</p>`
            : `<p class="success">✅ Remaining Balance: $${remainingBalance.toFixed(2)}</p>`;
    }
}

function showAddExpenseForm() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('expenseForm').style.display = 'block';
    document.getElementById('budgetSection').style.display = 'none';
}

function showBudgetSection() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('expenseForm').style.display = 'none';
    document.getElementById('budgetSection').style.display = 'block';
}

function returnToMainMenu() {
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('expenseForm').style.display = 'none';
    document.getElementById('budgetSection').style.display = 'none';
    document.getElementById('expenseList').innerHTML = '';
}

function exportToCSV() {
    if (expenses.length === 0) {
        alert('No expenses available to export.');
        return;
    }

    const headers = ['Date', 'Category', 'Amount', 'Description'];
    const csvContent = [
        headers.join(','), 
        ...expenses.map(expense => 
            `${expense.date},${expense.category},${expense.amount},${expense.description}`
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expenses.csv';
    link.click();
    alert('Expenses exported successfully!');
}

function importCSV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const lines = content.split('\n').slice(1); // Exclude header row
                lines.forEach(line => {
                    const [date, category, amount, description] = line.split(',');
                    if (date && category && amount && description) {
                        const expense = {
                            date: date.trim(),
                            category: category.trim(),
                            amount: parseFloat(amount.trim()),
                            description: description.trim()
                        };
                        expenses.push(expense);
                    }
                });
                updateBudgetStatus();
                alert('Expenses imported successfully!');
                returnToMainMenu();
            };
            reader.readAsText(file);
        }
    });

    input.click();
}

function exitApplication() {
    if (confirm('Are you sure you want to exit the application?')) {
        alert('Thank you for using the Expense Tracker!');
        window.close(); // Note: May not work in some browsers due to security restrictions
    }
}
