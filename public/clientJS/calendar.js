const timeGridCols = 12;
const timeGridRows = 24;
const timeGridMinutesDivider = 5;

document.addEventListener('DOMContentLoaded', function() {

    let timeCells = Array.from(document.getElementsByClassName('time-cell'));

    calendarControls();
    fillTools(timeCells);
    timeGrid(timeCells);
    saveFunctionality(timeCells);
});

function calendarControls(){
    let calendar = document.getElementById('calendar');
    let dateHeader = document.getElementById('date-header');
    let incrementDateBtn = document.getElementById('date-forward-btn');
    let decrementDateBtn = document.getElementById('date-backward-btn');
    let selectedDate = new Date();

    function updateDateUI(){
        // makes sure the dates are the same and not a day off because timezone weirdness
        let adjustedDate = new Date(selectedDate.toDateString());
        calendar.value = adjustedDate.toISOString().split('T')[0];
        dateHeader.innerText = adjustedDate.toDateString();
    }

    updateDateUI();

    calendar.addEventListener('change', (e) => {
        selectedDate = new Date(calendar.value);
        updateDateUI();
    });

    incrementDateBtn.addEventListener('click', (e) => {

        if(!selectedDate) return;

        const newDate = selectedDate.getDate() + 1;

        selectedDate.setDate(newDate);
        updateDateUI();

    });

    decrementDateBtn.addEventListener('click', (e) => {

        if(!selectedDate) return;

        const newDate = selectedDate.getDate() - 1;

        selectedDate.setDate(newDate);
        updateDateUI();

    });
}

function fillTools(timeCells){

    let fillStartTime = document.getElementById('fill-start-time');
    let fillEndTime = document.getElementById('fill-end-time');
    let fillBtn = document.getElementById('fill-btn');

    let fillAllBtn = document.getElementById('fill-all-btn');
    let clearAllBtn = document.getElementById('clear-all-btn');

    fillBtn.addEventListener('click', (e) => {
        // gets the hours and minutes as integers
        const [startHours, startMinutes] = [+fillStartTime.value.split(':')[0], +fillStartTime.value.split(':')[1]];
        const [endHours, endMinutes] = [+fillEndTime.value.split(':')[0], +fillEndTime.value.split(':')[1]];
        // calculates the target cell numbers based on the times
        const startCell = (startHours * timeGridCols) + Math.ceil(startMinutes / timeGridMinutesDivider);
        const endCell = (endHours * timeGridCols) + Math.ceil(endMinutes / timeGridMinutesDivider);

        // checks da boxes
        for(let cellNum = startCell; cellNum <= endCell; cellNum++){
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

function saveFunctionality(timeCells){

    let saveBtn = document.getElementById('save-btn');

    saveBtn.addEventListener('click', (e) => {
        console.log(getBusyTimes(timeCells));
    });

}

function timeGrid(timeCells){

    let timeGrid = document.getElementById('times-grid');

    let isLeftMouseDown = false;
    let isRightMouseDown = false;

    let lastEditedCell = null;

    timeGrid.addEventListener('contextmenu', (e) => {
        e.preventDefault();  // This prevents the right click menu from appearing
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

        // new cell behavior (left click to check, right click to uncheck)
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

            // prevents editing the cell you just edited
            if(e.target === lastEditedCell){
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

// takes timegrid cells and returns array of busy time pairs.
function getBusyTimes(timeCells){
    let busyTimes = [];

    let startCellID = null;

    for (let cellID in timeCells) {
        let cell = timeCells[cellID];
        // start of a busy time
        if (cell.checked && !startCellID) {
            startCellID = cellID;
        // end of a busy time
        } else if (!cell.checked && startCellID) {

            let startTime = startCellID * timeGridMinutesDivider;
            let endTime = cellID * timeGridMinutesDivider;

            busyTimes.push([startTime, endTime]);
            startCellID = null;
        }

    }

    // accounts for edge case where the last cell is filled
     if(startCellID && timeCells[timeCells.length - 1].checked){
        let startTime = startCellID * timeGridMinutesDivider;
        let endTime = timeCells.length * timeGridMinutesDivider;
         busyTimes.push([startTime, endTime]);
     }

    return busyTimes;
}