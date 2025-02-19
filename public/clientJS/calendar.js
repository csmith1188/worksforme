let userCalendar = new Map();
let userWeekDayTemplates = new Map();

let monthYear;
let calendarGrid;
let prevMonthButton;
let nextMonthButton;
let weekDayCells;

let timeGridPageContainer;
let calendarPageContainer;

let selectedDay = null;

//literly today
let currentDate = new Date();
const today = new Date();

document.addEventListener('DOMContentLoaded', function() {
    // Set things to other things to manipulate them
    monthYear = document.getElementById('month-year');
    calendarGrid = document.querySelector('.calendar-grid');
    prevMonthButton = document.getElementById('prev-month');
    nextMonthButton = document.getElementById('next-month');
    weekDayCells = Array.from(document.getElementsByClassName('week-day'));

    timeGridPageContainer = document.getElementById('timegrid-page-container');
    calendarPageContainer = document.getElementById('calendar-page-container');

    initCalendarControls();
    renderCalendar();

});

function goToTimeGridPage(day){

    selectedDay = day;

    let busyTimes = [];
    let isTemplate = false;

    // day is an exact date
    if(typeof day === 'string'){

        // if the user has a timegrid for that date in their calendar, load that
        if(userCalendar.has(day)){
            busyTimes = userCalendar.get(day);
        } else {
            let dayOfWeek = dayjs(day).day();
            // if the user has a template for that day of the week, load that
            if(userWeekDayTemplates.has(dayOfWeek)){
                busyTimes = userWeekDayTemplates.get(dayOfWeek);
            }
        }

    // day is a day of the week
    } else if(typeof day === 'number'){
        busyTimes = userWeekDayTemplates.get(day);
        isTemplate = true;
    }

    setTimeGrid(day, busyTimes, isTemplate);

    timeGridPageContainer.style.display = 'block';
    calendarPageContainer.style.display = 'none';
}


function exitTimeGridPage(day, newBusyTimes, timeGridEdited){

    updateCalendarData(day, newBusyTimes, timeGridEdited);

    selectedDay = null;

    // calendar must be rerendered to reflect changes
    renderCalendar();

    timeGridPageContainer.style.display = 'none';
    calendarPageContainer.style.display = 'block';
}

function updateCalendarData(day, newBusyTimes, timeGridEdited){

    let targetMap = null;   

    // day is an exact date
    if (typeof day === 'string') {
        targetMap = userCalendar;
    // day is a day of the week
    } else if (typeof day === 'number') {
        targetMap = userWeekDayTemplates;

        // if the new data is empty, completely delete the entry and exit the function early. Only applicable to templates.
        if(newBusyTimes.length === 0){
            targetMap.delete(day);
            return;
        }

    }

    if(!timeGridEdited) return;

    targetMap.set(day, newBusyTimes);
}

function dayCellClicked(event){
    console.log('yes');
    const cell = event.target;

    let day = null;

    if(cell.classList.contains('day')){
        // get date in yyyy-mm-dd format
        day = cell.id;
    } else if(cell.classList.contains('week-day')){
        // get day of week index
        day = getCellID(cell);
    }

    if(day !== null){

        // if it was a right click, remove the date. Only applicable to exact dates
        if(event.button === 2 && typeof day === 'string'){
            userCalendar.delete(day);
            renderCalendar();
        } else {
            goToTimeGridPage(day);
        }
    }
    
}

// This function is so skibby
function renderCalendar() {
    calendarGrid.innerHTML = '';
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // This sets the month and year in the calendar header
    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    // This is obv I dont think you need a comment here
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // For every empty cell before the first day of the month, create an empty cell
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    weekDayCells.forEach((weekDay, index) => {
        weekDay.addEventListener('click', dayCellClicked);
    });

    // For every day in the month, create a cell with the day number
    for (let day = 1; day <= daysInMonth; day++) {

        const date = `${year}-${month + 1}-${day}`;
        const dayCell = document.createElement('div');

        dayCell.classList.add('day');
        if(userCalendar.has(date)) dayCell.classList.add('custom-day');

        dayCell.textContent = day;
        dayCell.id = `${year}-${month + 1}-${day}`;
        dayCell.addEventListener('mouseup', dayCellClicked);
        dayCell.addEventListener('contextmenu', (e) => {
            e.preventDefault();  // This prevents the right click menu from appearing
        });
        calendarGrid.appendChild(dayCell);
    }

    // No going back in time for you
    // Yet...
    prevMonthButton.disabled = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
}

function initCalendarControls(){
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}