

const tastAddBtn = document.querySelector('.task-add-btn');

const taskCreaterForm = document.querySelector('#task-creater-form');

const taskCardContainer = document.querySelector('#task-cards-container');

const taskCreateModule = document.querySelector('.task-create-module');

const categoryDropdown = document.querySelector('#task-category-select');

const clearAllBtn = document.querySelector('#clear-all-btn');

const taskTitleInput = document.querySelector('#task-title-input');

// Get data from localStorage
let TaskData = getData("TaskData") ?? [];

let updateIndex = null;

// select all task Record and set 
const totalTask = document.querySelector('#count-total');
const completeTask = document.querySelector('#count-completed');
const pendingTask = document.querySelector('#count-pending');


function setRecord() {
    totalTask.textContent = TaskData.length;
    let pTask = TaskData.filter(el => el.status == true).length;
    pendingTask.textContent = pTask;
    completeTask.textContent = TaskData.length - pTask;
}

setRecord()


// display UI
Ui(TaskData);

// taskTitleInput feature and event listener

let typingTimer;

taskTitleInput.addEventListener('input', (e) => {

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
        let searchTerm = e.target.value.toLowerCase();
        let searchOutPut = TaskData.filter(el => el.taskTitle.toLowerCase().includes(searchTerm))
        Ui(searchOutPut);

    }, 300);


})

// Clear button feature 

clearAllBtn.addEventListener('click', () => {

    TaskData = [];
    Ui(TaskData);
    setRecord();
    saveData(TaskData);


})

// category dropdown feature 
categoryDropdown.addEventListener('change', (e) => {
    Ui(TaskData.filter(el => el.taskCategory == e.target.value));
})

// Task create Event 
taskCreaterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let taskTitle = e.target[0].value;
    let taskCategory = e.target[1].value;
    let taskObj = {
        id: Date.now(),
        taskTitle,
        taskCategory,
        status: true,

    }

    if (taskTitle.trim() == "") {
        alert("Please Enter Task Title");
        return;
    }

    if (updateIndex !== null) {
        e.target[2].textContent = "Add Task";
        TaskData[updateIndex] = taskObj;
        saveData(TaskData);
        Ui(TaskData);
        taskCreateModule.classList.toggle('edit');
        updateIndex = null;

    } else {

        TaskData.push(taskObj);
        saveData(TaskData);
        Ui(TaskData);
        setRecord()
    }
    taskCreaterForm.reset();

})



// This EventLIstener handle crud operation...  Using Event Deligation
taskCardContainer.addEventListener('click', (e) => {
    if (e.target.textContent === "Edit") editTaskHandler(e);
    if (e.target.textContent === "Complete" || e.target.textContent === "Undo") completeTaskHandler(e);
    if (e.target.textContent === "Delete") deleteTaskHandler(e);
    // console.log(e.currentTarget.parentElement);

})

function editTaskHandler(e) {
    let cardId = e.target.closest('.task-card').getAttribute('data-id');
    let data = TaskData.find(el => el.id == cardId);
    updateIndex = TaskData.findIndex(el => el.id == cardId)

    taskCreaterForm[0].value = data.taskTitle;
    taskCreaterForm[1].value = data.taskCategory;
    taskCreaterForm[2].textContent = "Edit Task"

    taskCreateModule.classList.toggle('edit');

}

function completeTaskHandler(e) {

    let cardId = e.target.closest('.task-card').getAttribute('data-id');

    TaskData.forEach(el => {

        if (el.id == cardId) {
            el.status = !el.status;
            return;
        }
    })

    saveData(TaskData);
    setRecord()
    Ui(TaskData);
}

function deleteTaskHandler(e) {

    let cardId = e.target.closest('.task-card').getAttribute('data-id')

    TaskData = TaskData.filter((el) => el.id != cardId);

    saveData(TaskData);

    Ui(TaskData);

    setRecord()

}


// this function used update the Task in UI
function Ui(TaskData) {
    if (TaskData.length != 0) {
        taskCardContainer.innerHTML = '';

        TaskData.forEach(el => {

            taskCardContainer.innerHTML += `
          <div class="task-card" data-id="${el.id}" data-status="active" data-category="Frontend">

                    <div class="task-info">
                        <h3 class="task-title">${el.taskTitle}</h3>
                        <span class="task-category-badge badge-frontend">${el.taskCategory}</span>
                    </div>

                    <div class="task-status-metadata">
                        <span class="status-indicator tag-active">${el.status ? "Active" : "Completed"}</span>
                    </div>

                    <div class="crud-actions-group">
                        <button type="button" class="btn-action btn-edit">Edit</button>
                        <button type="button" class="btn-action btn-complete">${el.status ? "Complete" : "Undo"}</button>
                        <button type="button" class="btn-action btn-delete">Delete</button>
                    </div>

                </div>`

        });

    } else {
        taskCardContainer.innerHTML = `<h3>No Task Availabe</h3>`
    }
}


// this function used to store data in localStorage

function saveData(TaskData) {

    localStorage.setItem("TaskData", JSON.stringify(TaskData))
}

// This function getting data from local Storage...
function getData(key) {
    let data = localStorage.getItem(key)

    if (data) return JSON.parse(data);
    else return data;
}




// Extra Task section start there


// Input Demonstration: value Property vs value Attribute
const inputEl = document.getElementById('demo-input');
const compareBtn = document.getElementById('check-values-btn');

compareBtn.addEventListener('click', () => {
    console.log("--- value Property vs Attribute Comparison ---");


    console.log("input.value (Property):", inputEl.value);


    console.log("input.getAttribute('value') (Attribute):", inputEl.getAttribute('value'));
});


// 7️⃣ EVENT PROPAGATION LOGIC
const grandparent = document.getElementById('grandparent');
const parent = document.getElementById('parent');
const childBtn = document.getElementById('child-btn');

// Clear logs helper to read sequences cleanly in console panels
const logSeparator = (phaseName) => console.log(`\n--- Triggering ${phaseName} Phase ---`);

// --- EVENT BUBBLING (Third parameter = false / omitted default) ---
// In Bubbling, handlers execute from the innermost node (target) upward to outermost ancestors.
grandparent.addEventListener('click', () => {
    console.log('Grandparent [Bubbling Triggered]');
}, false);

parent.addEventListener('click', () => {
    console.log('Parent [Bubbling Triggered]');
}, false);

childBtn.addEventListener('click', (e) => {
    logSeparator('Bubbling');
    console.log('Child [Bubbling Triggered]');
}, false);


// --- EVENT CAPTURING (Third parameter = true) ---
grandparent.addEventListener('click', () => {
    console.log('Grandparent [Capturing Triggered]');
}, true);

parent.addEventListener('click', () => {
    console.log('Parent [Capturing Triggered]');
}, true);

childBtn.addEventListener('click', (e) => {
    logSeparator('Capturing');
    console.log('Child [Capturing Triggered]');
}, true);


const toggleBtn = document.querySelector('.theme-btn');

toggleBtn.addEventListener('click', () => {
    // Get the current theme from the <html> element
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Switch to the opposite theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    toggleBtn.textContent = newTheme == "dark" ? 'light' : 'dark';

    // Set the new attribute value
    document.documentElement.setAttribute('data-theme', newTheme);
});