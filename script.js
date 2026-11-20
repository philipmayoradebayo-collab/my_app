
/* ==================================================
   DAYBOOK — A SMALL TO-DO APP

   Core JavaScript concepts:
   Arrays, Objects, localStorage, DOM Manipulation,
   Event Listeners, Template Strings and Functions.
================================================== */


/* ---------- 1. STATE ---------- */

// Load saved tasks from localStorage.
// If no saved tasks exist, start with an empty array.

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem('daybook-tasks')
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks;
    }

} catch (error) {
    console.error('Could not load saved tasks:', error);
}

let currentFilter = 'all';


/* ---------- 2. GET HTML ELEMENTS ---------- */

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const nextIndex = document.getElementById('next-index');

const filterRow = document.getElementById('filter-row');
const clearCompletedBtn = document.getElementById('clear-completed');


/* ---------- 3. SAVE TASKS ---------- */

function saveTasks() {

    try {
        localStorage.setItem(
            'daybook-tasks',
            JSON.stringify(tasks)
        );

    } catch (error) {
        console.error('Could not save tasks:', error);
    }
}


/* ---------- 4. ESCAPE HTML ---------- */

// Prevent task text from being interpreted as HTML.

function escapeHtml(text) {

    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;
}


/* ---------- 5. DISPLAY TASKS ---------- */

function render() {

    let visibleTasks = tasks;

    // Show active tasks only.
    if (currentFilter === 'active') {

        visibleTasks = tasks.filter(
            task => !task.completed
        );
    }

    // Show completed tasks only.
    else if (currentFilter === 'completed') {

        visibleTasks = tasks.filter(
            task => task.completed
        );
    }

    // Clear the current list.
    list.innerHTML = '';

    // Display each visible task.
    visibleTasks.forEach(task => {

        const li = document.createElement('li');

        li.className = 'task-item';

        if (task.completed) {
            li.classList.add('is-completed');
        }

        li.dataset.id = task.id;

        li.innerHTML = `
            <input
                type="checkbox"
                class="task-check"
                ${task.completed ? 'checked' : ''}
                aria-label="Mark ${escapeHtml(task.text)} as complete"
            >

            <span class="task-text">
                ${escapeHtml(task.text)}
            </span>

            <button
                type="button"
                class="delete-btn"
                aria-label="Delete ${escapeHtml(task.text)}"
            >
                Remove
            </button>
        `;

        list.appendChild(li);
    });


    // Show empty message when no tasks are visible.
    emptyState.classList.toggle(
        'is-visible',
        visibleTasks.length === 0
    );


    // Count active tasks.
    const activeCount = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
        `${activeCount} task${activeCount === 1 ? '' : 's'}`;


    // Update task numbering.
    nextIndex.textContent =
        String(tasks.length + 1).padStart(2, '0');


    // Save current tasks.
    saveTasks();
}


/* ---------- 6. ADD NEW TASK ---------- */

form.addEventListener('submit', function(event) {

    event.preventDefault();

    const text = input.value.trim();

    // Do not add an empty task.
    if (text === '') {
        return;
    }

    // Create a new task object.
    tasks.push({

        id: Date.now(),

        text: text,

        completed: false

    });

    // Clear the input field.
    input.value = '';

    // Display updated tasks.
    render();

    // Return focus to the input.
    input.focus();

});


/* ---------- 7. COMPLETE OR DELETE TASKS ---------- */

// Event delegation handles task buttons and checkboxes.

list.addEventListener('click', function(event) {

    const li = event.target.closest('.task-item');

    if (!li) {
        return;
    }

    const id = Number(li.dataset.id);


    // Complete or uncomplete a task.
    if (event.target.classList.contains('task-check')) {

        tasks = tasks.map(task => {

            if (task.id === id) {

                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;

        });

        render();
    }


    // Delete a task.
    if (event.target.classList.contains('delete-btn')) {

        tasks = tasks.filter(
            task => task.id !== id
        );

        render();
    }

});


/* ---------- 8. FILTER TASKS ---------- */

filterRow.addEventListener('click', function(event) {

    const button = event.target.closest('.filter-btn');

    if (!button) {
        return;
    }

    // Update current filter.
    currentFilter = button.dataset.filter;

    // Update active filter button.
    document.querySelectorAll('.filter-btn').forEach(btn => {

        btn.classList.remove('is-active');

        btn.setAttribute('aria-pressed', 'false');

    });

    button.classList.add('is-active');

    button.setAttribute('aria-pressed', 'true');

    // Display filtered tasks.
    render();

});


/* ---------- 9. CLEAR COMPLETED TASKS ---------- */

clearCompletedBtn.addEventListener('click', function() {

    tasks = tasks.filter(
        task => !task.completed
    );

    render();

});


/* ---------- 10. INITIAL PAGE LOAD ---------- */

// Display saved tasks when the page opens.

render();
