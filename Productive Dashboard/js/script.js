// --------------------------------------------------
// This portion for navbar sky color handling
// -----------------------------------------------------

const skyColorManual = {
    morning: {
        label: "Morning / Sunrise",
        timeRange: { start: 6, end: 11 },
        background: "linear-gradient(180deg, #FFB347 0%, #F1A7A1 50%, #A1C4FD 100%)",
        textColor: "#2C3E50"
    },
    afternoon: {
        label: "Afternoon",
        timeRange: { start: 11, end: 17 },
        background: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
        textColor: "#FFFFFF"
    },
    evening: {
        label: "Evening / Sunset",
        timeRange: { start: 17, end: 20 },
        background: "linear-gradient(180deg, #4B1248 0%, #F0C27B 100%)",
        textColor: "#FFFFFF"
    },
    night: {
        label: "Night",
        timeRange: { start: 20, end: 6 },
        background: "linear-gradient(180deg, #0B132B 0%, #1C2541 100%)",
        textColor: "#E0E1DD"
    }
};

function getSkyConfig(hour) {

    const { morning, afternoon, evening, night } = skyColorManual;
    if (hour >= morning.timeRange.start && hour < morning.timeRange.end) return morning;
    if (hour >= afternoon.timeRange.start && hour < afternoon.timeRange.end) return afternoon;
    if (hour >= evening.timeRange.start && hour < evening.timeRange.end) return evening;
    return night;
}

const hour = new Date().getHours();

const currentSky = getSkyConfig(hour);

const navbar = document.querySelector('.navbar');

navbar.style.background = currentSky.background;
navbar.style.color = currentSky.textColor;


// --------------------------
// Theme toggle handling (Step 9)
// -------------------------
const themeToggle = document.querySelector('#themeToggle');

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        themeToggle.setAttribute('title', 'Switch to light theme');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        themeToggle.setAttribute('title', 'Switch to dark theme');
    }
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
});

// Initial theme sync on load
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// -----------------------------------------------------
// Navigation Shell (Step 1)
// -----------------------------------------------------
let activeFeature = null;

const board = document.querySelector('.board');
const grid = document.querySelector('.grid');

/**
 * Opens a specific feature view section
 * @param {string} featureName
 */
function openFeature(featureName) {
    activeFeature = featureName;

    const targetSection = document.querySelector(`.feature-view[data-feature="${featureName}"]`);
    if (!targetSection) {
        activeFeature = null;
        return;
    }

    // Hide board (main dashboard)
    board.classList.add('hidden');

    // Show active feature section
    targetSection.classList.remove('hidden');

    // Automatically load quote on motivation view open
    if (featureName === 'motivation') {
        fetchQuote();
    }
    // Automatically load weather on weather view open
    if (featureName === 'weather') {
        loadWeather();
    }
}

//   Closes the currently active feature
function closeFeature() {

    const activeSection = document.querySelector(`.feature-view[data-feature="${activeFeature}"]`);
    if (activeSection) {
        activeSection.classList.add('hidden');
    }

    activeFeature = null;

    board.classList.remove('hidden');
}

// Event delegation on grid for card clicks
grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');

    if (!card) return;

    openFeature(card.dataset.feature);
});

// Wire up all back buttons to the reusable closeFeature function
document.querySelectorAll('.back-btn').forEach((btn) => {
    btn.addEventListener('click', closeFeature);
});

// -----------------------------------------------------
// Todo List Feature 
// -----------------------------------------------------
const todoInput = document.querySelector('#todoInput');
const addTodoBtn = document.querySelector('#addTodoBtn');
const todoList = document.querySelector('#todoList');
const todoCardFooter = document.querySelector('.card[data-feature="todo"] .card-footer');

let todos = [];

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
    } else {
        // Initialize with default template data matching "3 open"
        todos = [
            { id: Date.now() + '-1', text: 'Plan the upcoming weekly sprint', done: false, important: true },
            { id: Date.now() + '-2', text: 'Review team feedback on design proposals', done: false, important: false },
            { id: Date.now() + '-3', text: 'Prepare slides for Friday presentation', done: false, important: false }
        ];
        saveTodos();
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTodoFooter();
}

function updateTodoFooter() {
    if (todoCardFooter) {
        const openCount = todos.filter(t => !t.done).length;
        todoCardFooter.textContent = `${openCount} open`;
    }
}

function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = `<li class="todo-empty-state" style="text-align: center; color: rgba(255,255,255,0.4); padding: 2rem;">No tasks yet. Enjoy your day!</li>`;
        return;
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.done ? 'done' : ''} ${todo.important ? 'important' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <div class="todo-content-wrapper">
                <button class="todo-checkbox ${todo.done ? 'checked' : ''}" aria-label="Mark task done">
                    ${todo.done ? '<i class="fa-solid fa-check"></i>' : ''}
                </button>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
            </div>
            <div class="todo-actions">
                <button class="todo-btn star-btn" aria-label="Mark task important">
                    <i class="${todo.important ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                </button>
                <button class="todo-btn delete-btn" aria-label="Delete task">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now().toString(),
        text: text,
        done: false,
        important: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Add todo listeners
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Event delegation on todoList
todoList.addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;

    const id = item.dataset.id;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return;

    // Checkbox toggle
    if (e.target.closest('.todo-checkbox')) {
        todos[todoIndex].done = !todos[todoIndex].done;
        saveTodos();
        renderTodos();
    }
    // Star toggle
    else if (e.target.closest('.star-btn')) {
        todos[todoIndex].important = !todos[todoIndex].important;
        saveTodos();
        renderTodos();
    }
    // Delete action
    else if (e.target.closest('.delete-btn')) {
        todos.splice(todoIndex, 1);
        saveTodos();
        renderTodos();
    }
});


// -----------------------------------------------------
// Daily Planner Feature (Step 3)
// -----------------------------------------------------
const plannerContainer = document.querySelector('#plannerContainer');
let plannerData = {};

function formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
}

function loadPlanner() {
    const stored = localStorage.getItem('planner');
    if (stored) {
        plannerData = JSON.parse(stored);
    } else {
        plannerData = {};
    }
}

function savePlanner() {
    localStorage.setItem('planner', JSON.stringify(plannerData));
}

function renderPlanner() {
    plannerContainer.innerHTML = '';
    const currentHour = new Date().getHours();

    for (let h = 6; h <= 23; h++) {
        const row = document.createElement('div');
        row.className = `planner-row ${h === currentHour ? 'current-hour' : ''}`;
        row.dataset.hour = h;

        const timeString = formatHour(h);
        const value = plannerData[h] || '';

        row.innerHTML = `
            <div class="planner-time">
                <span>${timeString}</span>
                ${h === currentHour ? '<span class="now-badge">Now</span>' : ''}
            </div>
            <input type="text" class="planner-input" value="${escapeHtml(value)}" placeholder="No plans scheduled" data-hour="${h}">
        `;
        plannerContainer.appendChild(row);
    }
}

// Event delegation for saving planner inputs on focus loss (blur)
plannerContainer.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('planner-input')) {
        const hour = e.target.dataset.hour;
        const value = e.target.value.trim();

        if (value) {
            plannerData[hour] = value;
        } else {
            delete plannerData[hour];
        }

        savePlanner();
    }
});

// Allow Enter key to trigger blur and save
plannerContainer.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('planner-input') && e.key === 'Enter') {
        e.target.blur();
    }
});

// -----------------------------------------------------
// Daily Goals Feature (Step 4)
// -----------------------------------------------------
const goalInput = document.querySelector('#goalInput');
const addGoalBtn = document.querySelector('#addGoalBtn');
const goalList = document.querySelector('#goalList');
const goalsCardFooter = document.querySelector('#goalsFooter');

let goals = [];

function loadGoals() {
    const stored = localStorage.getItem('goals');
    if (stored) {
        goals = JSON.parse(stored);
    } else {
        // Initialize with default template data matching "0 of 4"
        goals = [
            { id: Date.now() + '-1', text: 'Drink 3L of water', done: false },
            { id: Date.now() + '-2', text: 'Complete code review assignments', done: false },
            { id: Date.now() + '-3', text: 'Exercise for 30 minutes', done: false },
            { id: Date.now() + '-4', text: 'Read 10 pages of a book', done: false }
        ];
        saveGoals();
    }
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
    updateGoalsFooter();
}

function updateGoalsFooter() {
    if (goalsCardFooter) {
        const completedCount = goals.filter(g => g.done).length;
        goalsCardFooter.textContent = `${completedCount} of ${goals.length} completed`;
    }
}

function renderGoals() {
    goalList.innerHTML = '';

    if (goals.length === 0) {
        goalList.innerHTML = `<li class="todo-empty-state" style="text-align: center; color: rgba(255,255,255,0.4); padding: 2rem;">No goals set for today yet.</li>`;
        return;
    }

    goals.forEach(goal => {
        const li = document.createElement('li');
        li.className = `goal-item ${goal.done ? 'done' : ''}`;
        li.dataset.id = goal.id;

        li.innerHTML = `
            <div class="goal-content-wrapper">
                <button class="goal-checkbox ${goal.done ? 'checked' : ''}" aria-label="Toggle goal complete">
                    ${goal.done ? '<i class="fa-solid fa-check"></i>' : ''}
                </button>
                <span class="goal-text">${escapeHtml(goal.text)}</span>
            </div>
            <div class="todo-actions">
                <button class="goal-btn delete-btn" aria-label="Delete goal">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        goalList.appendChild(li);
    });
}

function addGoal() {
    const text = goalInput.value.trim();
    if (!text) return;

    const newGoal = {
        id: Date.now().toString(),
        text: text,
        done: false
    };

    goals.push(newGoal);
    saveGoals();
    renderGoals();
    goalInput.value = '';
    goalInput.focus();
}

// Add goals listeners
addGoalBtn.addEventListener('click', addGoal);
goalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addGoal();
    }
});

// Event delegation on goalList
goalList.addEventListener('click', (e) => {
    const item = e.target.closest('.goal-item');
    if (!item) return;

    const id = item.dataset.id;
    const goalIndex = goals.findIndex(g => g.id === id);
    if (goalIndex === -1) return;

    // Checkbox toggle
    if (e.target.closest('.goal-checkbox')) {
        goals[goalIndex].done = !goals[goalIndex].done;
        saveGoals();
        renderGoals();
    }
    // Delete action
    else if (e.target.closest('.delete-btn')) {
        goals.splice(goalIndex, 1);
        saveGoals();
        renderGoals();
    }
});

// -----------------------------------------------------
// Pomodoro Timer Feature (Step 5)
// -----------------------------------------------------
const pomodoroTime = document.querySelector('#pomodoroTime');
const pomodoroStatus = document.querySelector('#pomodoroStatus');
const pomodoroStart = document.querySelector('#pomodoroStart');
const pomodoroPause = document.querySelector('#pomodoroPause');
const pomodoroReset = document.querySelector('#pomodoroReset');
const progressCircle = document.querySelector('.progress-ring__circle');
const pomodoroCardFooter = document.querySelector('.card[data-feature="pomodoro"] .card-footer');

const defaultDuration = 1500; // 25 minutes in seconds
let remainingSeconds = defaultDuration;
let pomodoroIntervalId = null;
let pomodoroIsRunning = false;

const progressCircumference = 615.75;

function setProgress(percent) {
    const offset = progressCircumference - (percent / 100) * progressCircumference;
    if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    pomodoroTime.textContent = formatTime(remainingSeconds);
    const progressPercent = (remainingSeconds / defaultDuration) * 100;
    setProgress(progressPercent);

    // Update main dashboard card footer too!
    if (pomodoroCardFooter) {
        if (pomodoroIsRunning) {
            pomodoroCardFooter.textContent = `${formatTime(remainingSeconds)} running`;
        } else if (remainingSeconds < defaultDuration) {
            pomodoroCardFooter.textContent = `${formatTime(remainingSeconds)} paused`;
        } else {
            pomodoroCardFooter.textContent = '25:00 ready';
        }
    }
}

function playChime() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);

        setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
            gain2.gain.setValueAtTime(0.5, ctx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
            osc2.start(ctx.currentTime);
            osc2.stop(ctx.currentTime + 0.8);
        }, 300);
    } catch (e) {
        console.error('Audio chime failed', e);
    }
}

function startPomodoro() {
    if (pomodoroIntervalId) return;

    pomodoroIsRunning = true;
    pomodoroStatus.textContent = 'Focusing...';
    pomodoroStart.disabled = true;
    pomodoroPause.disabled = false;

    pomodoroIntervalId = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(pomodoroIntervalId);
            pomodoroIntervalId = null;
            pomodoroIsRunning = false;
            pomodoroStatus.textContent = 'Session complete!';

            if (pomodoroCardFooter) {
                pomodoroCardFooter.textContent = 'Finished!';
            }

            pomodoroStart.disabled = false;
            pomodoroPause.disabled = true;
            playChime();
        }
    }, 1000);

    updateTimerDisplay();
}

function pausePomodoro() {
    if (!pomodoroIntervalId) return;

    clearInterval(pomodoroIntervalId);
    pomodoroIntervalId = null;
    pomodoroIsRunning = false;
    pomodoroStatus.textContent = 'Timer paused';
    pomodoroStart.disabled = false;
    pomodoroPause.disabled = true;

    updateTimerDisplay();
}

function resetPomodoro() {
    clearInterval(pomodoroIntervalId);
    pomodoroIntervalId = null;
    pomodoroIsRunning = false;
    remainingSeconds = defaultDuration;
    pomodoroStatus.textContent = 'Ready to Focus';

    pomodoroStart.disabled = false;
    pomodoroPause.disabled = true;

    updateTimerDisplay();
}

// Timer button listeners
pomodoroStart.addEventListener('click', startPomodoro);
pomodoroPause.addEventListener('click', pausePomodoro);
pomodoroReset.addEventListener('click', resetPomodoro);

// Initialize SVG circular offset
setProgress(100);

// -----------------------------------------------------
// Motivation Quote Feature (Step 6)
// -----------------------------------------------------
const quoteText = document.querySelector('#quoteText');
const quoteAuthor = document.querySelector('#quoteAuthor');
const quoteLoader = document.querySelector('#quoteLoader');
const quoteContent = document.querySelector('#quoteContent');
const newQuoteBtn = document.querySelector('#newQuoteBtn');

const fallbackQuotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

async function fetchQuote() {
    // Show loading state
    quoteContent.classList.add('hidden');
    quoteLoader.classList.remove('hidden');
    newQuoteBtn.disabled = true;

    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error('Network response not ok');

        const data = await response.json();

        quoteText.textContent = data.quote;
        quoteAuthor.textContent = `— ${data.author}`;
    } catch (error) {
        console.warn('Quote fetch failed, loading fallback quote:', error);
        // Load random fallback quote
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        const fallback = fallbackQuotes[randomIndex];
        quoteText.textContent = fallback.quote;
        quoteAuthor.textContent = `— ${fallback.author}`;
    } finally {
        // Hide loading state
        quoteLoader.classList.add('hidden');
        quoteContent.classList.remove('hidden');
        newQuoteBtn.disabled = false;
    }
}

newQuoteBtn.addEventListener('click', fetchQuote);

// -----------------------------------------------------
// Date & Time Display (Step 8)
// -----------------------------------------------------
const navDate = document.querySelector('#navDate');
const navTime = document.querySelector('#navTime');

function updateDateTime() {
    if (!navDate || !navTime) return;

    const now = new Date();

    // Format Date: e.g., "Friday, July 10"
    const optionsDate = { weekday: 'long', month: 'long', day: 'numeric' };
    navDate.textContent = now.toLocaleDateString('en-US', optionsDate);

    // Format Time: e.g., "04:36:57 PM"
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    navTime.textContent = now.toLocaleTimeString('en-US', optionsTime);
}

// Guard against duplicate intervals
if (window.dateTimeIntervalId) {
    clearInterval(window.dateTimeIntervalId);
}
updateDateTime(); // Update once immediately
window.dateTimeIntervalId = setInterval(updateDateTime, 1000);


// -----------------------------------------------------
// Weather Widget Feature (Step 7)
// -----------------------------------------------------
const weatherLoader = document.querySelector('#weatherLoader');
const weatherError = document.querySelector('#weatherError');
const weatherErrorMsg = document.querySelector('#weatherErrorMsg');
const weatherContent = document.querySelector('#weatherContent');
const weatherIcon = document.querySelector('#weatherIcon');
const weatherTemp = document.querySelector('#weatherTemp');
const weatherDesc = document.querySelector('#weatherDesc');
const weatherLocation = document.querySelector('#weatherLocation');
const weatherWind = document.querySelector('#weatherWind');
const weatherHumidity = document.querySelector('#weatherHumidity');
const weatherCardDesc = document.querySelector('#weatherCardDesc');
const weatherCardFooter = document.querySelector('#weatherCardFooter');
const weatherRefreshBtn = document.querySelector('#weatherRefreshBtn');
const weatherRetryBtn = document.querySelector('#weatherRetryBtn');

function getWeatherMapping(code) {
    // Mapping weather codes (WMO code) to human-readable format & font awesome icons
    if (code === 0) return { text: "Clear Sky", icon: '<i class="fa-solid fa-sun"></i>' };
    if ([1, 2, 3].includes(code)) return { text: "Partly Cloudy", icon: '<i class="fa-solid fa-cloud-sun"></i>' };
    if ([45, 48].includes(code)) return { text: "Foggy", icon: '<i class="fa-solid fa-smog"></i>' };
    if ([51, 53, 55, 56, 57].includes(code)) return { text: "Drizzle", icon: '<i class="fa-solid fa-cloud-rain"></i>' };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { text: "Raining", icon: '<i class="fa-solid fa-cloud-showers-heavy"></i>' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { text: "Snowing", icon: '<i class="fa-solid fa-snowflake"></i>' };
    if ([95, 96, 99].includes(code)) return { text: "Thunderstorm", icon: '<i class="fa-solid fa-cloud-bolt"></i>' };
    return { text: "Cloudy", icon: '<i class="fa-solid fa-cloud"></i>' };
}

async function fetchWeatherData(lat, lon, locationName) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        if (!response.ok) throw new Error("Weather forecast service is currently offline.");

        const data = await response.json();
        if (!data.current) throw new Error("API response error");

        const current = data.current;
        const temp = Math.round(current.temperature_2m);
        const code = current.weather_code;
        const mapping = getWeatherMapping(code);
        const wind = Math.round(current.wind_speed_10m);
        const humidity = current.relative_humidity_2m;

        // Update DOM elements inside Feature Section
        if (weatherTemp) weatherTemp.textContent = `${temp}°C`;
        if (weatherDesc) weatherDesc.textContent = mapping.text;
        if (weatherIcon) weatherIcon.innerHTML = mapping.icon;
        if (weatherLocation) weatherLocation.textContent = locationName;
        if (weatherWind) weatherWind.textContent = `${wind} km/h`;
        if (weatherHumidity) weatherHumidity.textContent = `${humidity}%`;

        // Update main Dashboard Weather card elements
        if (weatherCardDesc) weatherCardDesc.textContent = mapping.text;
        if (weatherCardFooter) weatherCardFooter.textContent = `${temp}°C · ${locationName}`;

        // Toggle visibility
        if (weatherLoader) weatherLoader.classList.add('hidden');
        if (weatherError) weatherError.classList.add('hidden');
        if (weatherContent) weatherContent.classList.remove('hidden');
    } catch (error) {
        console.warn("Fetch weather failed:", error);
        showWeatherError("Failed to fetch weather forecast data.");
    }
}

function showWeatherError(message) {
    if (weatherErrorMsg) weatherErrorMsg.textContent = message;

    if (weatherLoader) weatherLoader.classList.add('hidden');
    if (weatherContent) weatherContent.classList.add('hidden');
    if (weatherError) weatherError.classList.remove('hidden');

    // Fallback card titles on failure
    if (weatherCardDesc) weatherCardDesc.textContent = "Weather unavailable";
    if (weatherCardFooter) weatherCardFooter.textContent = "Error loading";
}

function loadWeather() {
    if (weatherLoader) weatherLoader.classList.remove('hidden');
    if (weatherContent) weatherContent.classList.add('hidden');
    if (weatherError) weatherError.classList.add('hidden');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon, "Local Weather");
            },
            (error) => {
                console.warn("Geolocation access denied/failed. Falling back to Jamshedpur.", error);
                // Jamshedpur coordinates
                fetchWeatherData(22.8046, 86.2029, "Jamshedpur");
            },
            { timeout: 8000 }
        );
    } else {
        console.warn("Geolocation API not supported by browser. Falling back to Jamshedpur.");
        fetchWeatherData(22.8046, 86.2029, "Jamshedpur");
    }
}

if (weatherRefreshBtn) weatherRefreshBtn.addEventListener('click', loadWeather);
if (weatherRetryBtn) weatherRetryBtn.addEventListener('click', loadWeather);


// -----------------------------------------------------
// Initialize Features on Load
// -----------------------------------------------------
loadTodos();
renderTodos();

loadPlanner();
renderPlanner();

loadGoals();
renderGoals();

// Fetch weather once on start to update the main dashboard card
loadWeather();