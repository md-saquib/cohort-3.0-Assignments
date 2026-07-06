const dashboardPanel = document.querySelector('.right-panel-bottom');
const settingPanel = document.querySelector('.settings-page');
const dashboard = document.querySelector('.dashboard');
const setting = document.querySelector('.setting')

const totalBalance = document.querySelector('#balance');
const totalIncome = document.querySelector('#income');
const totalTransection = document.querySelector('#transection');
const totalExpense = document.querySelector('#expenses');

let balance = 0;
let income = 0;
let expense = 0;
let transection = 0;

const transactionForm = document.querySelector('.modal-overlay');
const closeBtn = document.querySelector('.close-btn');
const addTransction = document.querySelector('.left-panel-bottom');

const addTransctionData = document.querySelector('.transaction-form')
const cardContainer = document.querySelector('.cards');

const resetButton = document.querySelector('.reset-button');

const taskTitleInput = document.querySelector('#task-title-input');

const categoryDropdown = document.querySelector('#category-dropdown');

// 2. Grab the Canvas Context
const ctx = document.getElementById('cashFlowChart').getContext('2d');

// 3. Define the Chart Configuration
const config = {
    type: 'bar',
    data: {
        // Single X-axis label exactly like the image
        labels: ['Income vs Expenses'],
        datasets: [
            {
                label: 'Income',
                data: [income],
                backgroundColor: '#116530',
                borderWidth: 0,
                barPercentage: 0.8,
                categoryPercentage: 0.7
            },
            {
                label: 'Expenses',
                data: [expense],
                backgroundColor: '#941B1B',
                borderWidth: 0,
                barPercentage: 0.8,
                categoryPercentage: 0.7
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: false, // Box style legends
                    boxWidth: 40,
                    boxHeight: 12,
                    font: { size: 13 }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString(); // Formats with commas (e.g., 10,000)
                    }
                },
                grid: {
                    color: '#eef0f2' // Subtle light grey grid lines
                }
            },
            x: {
                grid: {
                    display: false // Hides vertical grid lines just like the image
                },
                ticks: {
                    color: '#666666',
                    font: { size: 14 }
                }
            }
        }
    }
};

const toggleBtn = document.querySelector('#theme-button');

// 4. Render the Chart
const cashFlowChart = new Chart(ctx, config);

// this event used to open the dashboard panel
dashboard.addEventListener('click', () => {
    settingPanel.style.display = 'none';
    dashboardPanel.style.display = 'block';
    console.log("i am dashboard")

})

// this event used to open the setting panel
setting.addEventListener('click', () => {
    settingPanel.style.display = 'block';
    dashboardPanel.style.display = 'none';
    console.log("i am dashboard")


})

let cardData = getData('cardData') ?? [];




// this event used to open the transaction form
addTransction.addEventListener('click', () => {
    transactionForm.style.display = 'flex';
})

// this event used to close the transaction form

closeBtn.addEventListener('click', () => {
    transactionForm.style.display = 'none';
})



Ui(cardData);

// this event used to add new transaction data in the list and also update the record of the total balance ,income , expense and
addTransctionData.addEventListener('submit', (e) => {
    e.preventDefault();

    const obj = {
        id: Date.now(),
        type: e.target[0].value,
        description: e.target[1].value,
        amount: e.target[2].value,
        date: e.target[3].value,
        category: e.target[4].value,

    }


    cardData.push(obj);
    saveData(cardData)
    Ui(cardData)

    transactionForm.style.display = 'none';

    addTransctionData.reset();
})




// this event used to delete card from the list 

cardContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('fa-trash-can')) return;

    let cardId = e.target.closest('.card').getAttribute('data-id');

    cardData = cardData.filter(el => el.id != cardId);
    saveData(cardData);
    Ui(cardData);

})

// this function used to update the ui of the card list and also update the record of the total balance ,income , expense and 
function Ui(cardData) {
    resetRecord();

    if (cardData.length != 0) {
        cardContainer.innerHTML = '';

        cardData.forEach(el => {
            if (el.type.toLowerCase() === 'expense') expense += Number(el.amount);
            else income += Number(el.amount);

            cardContainer.innerHTML += `
          <div class="card" data-id="${el.id}">
                        <p class="card-date"> ${el.date} </p>
                        <p class="card-description"> ${el.description} </p>
                        <p class="card-category"> ${el.category} </p>
                        <p class="${el.type.toLowerCase() === 'expense' ? 'card-amount-expense' : 'card-amount-income'}"> ${el.type.toLowerCase() === 'expense' ? '-' : '+'}${el.amount}</p>
                         <i class="fa-solid fa-trash-can"></i>
           </div>`
        });
        setRecord()

    } else {
        cardContainer.innerHTML = `<h3 class='noTransaction' >No Transaction Availabe</h3>`
        setRecord()
    }
}




// this event used to reset data
resetButton.addEventListener('click', () => {
    saveData([]);
    cardData = [];
    Ui(cardData)

})


// this function used to store data in localStorage

function saveData(cardData) {

    localStorage.setItem("cardData", JSON.stringify(cardData))
}

// This function getting data from local Storage...
function getData(key) {
    let data = localStorage.getItem(key)

    if (data) return JSON.parse(data);
    else return data;
}

function resetRecord() {
    balance = 0;
    income = 0;
    expense = 0;
    transection = 0
}

function setRecord() {

    totalBalance.textContent = income - expense;
    totalIncome.textContent = income;
    totalExpense.textContent = expense;
    totalTransection.textContent = cardData.length;
    updateCashFlow(income, expense);
    resetRecord();
}



let typingTimer;

taskTitleInput.addEventListener('input', (e) => {

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
        let searchTerm = e.target.value.toLowerCase();
        let searchOutPut = cardData.filter(el => el.description.toLowerCase().includes(searchTerm))
        Ui(searchOutPut);

    }, 300);
})

// category dropdown feature 
categoryDropdown.addEventListener('change', (e) => {

    if (e.target.value == 'All Categories') Ui(cardData);
    else Ui(cardData.filter(el => el.category == e.target.value));
})

// Call this function anytime your UI inputs or API data change!
function updateCashFlow(income, expense) {
    cashFlowChart.data.datasets[0].data = [income];
    cashFlowChart.data.datasets[1].data = [expense];
    cashFlowChart.update();
}


//this event used to toggle the theme of the application

toggleBtn.addEventListener('click', () => {
    // Get the current theme from the <html> element
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Switch to the opposite theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    toggleBtn.textContent = newTheme == "dark" ? 'light' : 'dark';

    // Set the new attribute value
    document.documentElement.setAttribute('data-theme', newTheme);
});