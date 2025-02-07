const timeGridCols = 12;
const timeGridRows = 24;
const timeGridMinutesDivider = 5;

document.addEventListener('DOMContentLoaded', function() {
    timeGrid();
    calendarControls();
    fillTools();
});

function calendarControls(){
    let calendar = document.getElementById('calendar');
    let incrementDateBtn = document.getElementById('date-forward-btn');
    let decrementDateBtn = document.getElementById('date-backward-btn');
    let selectedDate = null;

    calendar.addEventListener('change', (e) => {
        selectedDate = new Date(calendar.value);
    });

    incrementDateBtn.addEventListener('click', (e) => {

        if(!selectedDate) return;

        const newDate = selectedDate.getDate() + 1;

        selectedDate.setDate(newDate);
        calendar.value = selectedDate.toISOString().split('T')[0];

    });

    decrementDateBtn.addEventListener('click', (e) => {

        if(!selectedDate) return;

        const newDate = selectedDate.getDate() - 1;

        selectedDate.setDate(newDate);
        calendar.value = selectedDate.toISOString().split('T')[0];

    });
}

function fillTools(){
    let fillStartTime = document.getElementById('fill-start-time');
    let fillEndTime = document.getElementById('fill-end-time');
    let fillBtn = document.getElementById('fill-btn');

    let fillAllBtn = document.getElementById('fill-all-btn');
    let clearAllBtn = document.getElementById('clear-all-btn');

    let timeCells = Array.from(document.getElementsByClassName('time-cell'));

    fillBtn.addEventListener('click', (e) => {
        const [startHours, startMinutes] = [+fillStartTime.value.split(':')[0], +fillStartTime.value.split(':')[1]];
        const [endHours, endMinutes] = [+fillEndTime.value.split(':')[0], +fillEndTime.value.split(':')[1]];
        const startCell = (startHours * timeGridCols) + Math.ceil(startMinutes / timeGridMinutesDivider);
        const endCell = (endHours * timeGridCols) + Math.ceil(endMinutes / timeGridMinutesDivider);

        for(let cellNum = startCell; cellNum <= endCell; cellNum++){
            console.log(cellNum);
            document.getElementById('time-cell-' + cellNum).checked = true;
        }
    });

    fillAllBtn.addEventListener('click', (e) => {
        timeCells.forEach(cell => {
            cell.checked = true;
        })
    });

    clearAllBtn.addEventListener('click', (e) => {
        timeCells.forEach(cell => {
            cell.checked = false;
        })
    });
}

function timeGrid(){

    let timeGrid = document.getElementById('times-grid');
    let timeCells = Array.from(document.getElementsByClassName('time-cell'));

    let isLeftMouseDown = false;
    let isRightMouseDown = false;

    let lastEditedCell = null;

    timeGrid.addEventListener('contextmenu', (e) => {
        e.preventDefault();  // This prevents the right-click menu from appearing
    });

    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            isLeftMouseDown = true; 
        } else if (e.button === 2) {
            isRightMouseDown = true;
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isLeftMouseDown = false;
        } else if (e.button === 2) {
            isRightMouseDown = false;
        }
    });

    timeCells.forEach(cell => {

        // new checkbox behavior (left click to check, right click to uncheck)
        cell.addEventListener('mouseup', (e) => {
            
            if (isLeftMouseDown) {
                // hacky but necessary
                setTimeout(() => {
                    e.target.checked = true;
                }, 10);
            } else if (isRightMouseDown) {
                e.target.checked = false;
            }

            lastEditedCell = e.target;
        });
    
      
        cell.addEventListener('mousemove', (e) => {

            if(e.target.className !== 'time-cell' || e.target === lastEditedCell){
                return;
            }

            if(isLeftMouseDown){
                e.target.checked = true;
                lastEditedCell = e.target;
            } else if(isRightMouseDown){
                e.target.checked = false;
                lastEditedCell = e.target;
            }

        });
    });
}