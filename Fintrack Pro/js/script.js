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

const userNameDisplay = document.querySelector('#user-name');

// 4. Render the Chart
const cashFlowChart = new Chart(ctx, config);

// this event used to open the dashboard panel
dashboard.addEventListener('click', () => {
    settingPanel.style.display = 'none';
    dashboardPanel.style.display = 'block';
})

// this event used to open the setting panel
setting.addEventListener('click', () => {
    settingPanel.style.display = 'block';
    dashboardPanel.style.display = 'none';
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
                        <p class="${el.type.toLowerCase() === 'expense' ? 'card-amount-expense' : 'card-amount-income'}">  ${el.type.toLowerCase() === 'expense' ? '-' : '+'}${el.amount}</p>
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









// login and logout  Elements
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');

const toRegisterLink = document.getElementById('to-register');
const toLoginLink = document.getElementById('to-login');

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

const registerMsg = document.getElementById('register-msg');
const loginMsg = document.getElementById('login-msg');

// This element select for profile update
const profileName = document.querySelector('#full-name');
const primaryCurrency = document.querySelector('#primary-currency');


// Toggle View Logic
toRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    clearMessages();
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
});

toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    clearMessages();
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});

function clearMessages() {
    registerMsg.className = 'message';
    registerMsg.innerText = '';
    loginMsg.className = 'message';
    loginMsg.innerText = '';
    registerForm.reset();
    loginForm.reset();
}

// Registration Logic
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;

    // Get existing users database or initialize a new array
    const users = JSON.parse(localStorage.getItem('fintrack_users')) || [];

    // Check if user already exists
    const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());

    if (userExists) {
        registerMsg.className = 'message error';
        registerMsg.innerText = 'Username is already taken!';
    } else {
        // Add new user to storage array
        users.push({ username, password });
        localStorage.setItem('fintrack_users', JSON.stringify(users));

        registerMsg.className = 'message success';
        registerMsg.innerText = 'Registration successful! Redirecting to login...';

        // Automatically switch to login screen after 1.5 seconds
        setTimeout(() => {
            toLoginLink.click();
            document.getElementById('login-username').value = username;
        }, 1500);
    }
});

// Login Logic
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    // Get existing users database
    const users = JSON.parse(localStorage.getItem('fintrack_users')) || [];

    // Find valid match
    const matchedUser = users.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

    if (matchedUser) {
        loginMsg.className = 'message success';
        loginMsg.innerText = `Welcome back, ${matchedUser.username}! Login successful.`;

        userNameDisplay.textContent = matchedUser.username;
        loginCard.classList.add('hidden');

        // Track current active session
        localStorage.setItem('fintrack_session', JSON.stringify({ loggedIn: true, user: matchedUser.username }));
    } else {
        loginMsg.className = 'message error';
        loginMsg.innerText = 'Invalid username or password.';
    }
});



// Function to check if a user is already logged in
function checkUserSession() {
    const sessionData = localStorage.getItem('fintrack_session');

    if (sessionData) {
        const session = JSON.parse(sessionData);

        if (session.loggedIn) {

            loginCard.classList.add('hidden');
            userNameDisplay.textContent = session.user;
            profileName.value = session.user;

        } else {
            alert("No active session found. User needs to login.");
        }
    }
}

// Run the check when the page opens
window.addEventListener('DOMContentLoaded', checkUserSession);


function handleLogout() {
    localStorage.removeItem('fintrack_session');
    window.location.reload();
}

//  logout button
document.getElementById('logout-btn').addEventListener('click', handleLogout);


//profile data save 

document.querySelector('#profile-btn').addEventListener('click', (e) => {
    e.preventDefault();
    userNameDisplay.textContent = profileName.value;
    document.querySelectorAll('.currency').forEach(el => el.textContent = primaryCurrency.value);

})
