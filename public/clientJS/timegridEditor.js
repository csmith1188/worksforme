const timeGridCols = 12;
const timeGridRows = 24;
const timeGridMinutesDivider = 5;

const daysOfTheWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const dateFormat = "ddd MMM DD YYYY";

document.addEventListener('DOMContentLoaded', function() {

    let timeCells = Array.from(document.getElementsByClassName('time-cell'));

    fillTools(timeCells);
    timeGrid(timeCells);
    saveFunctionality(timeCells);
});


function setTimeGridDay(day){
    const dateHeader = document.getElementById('date-header');

    // day is an exact date
    if(typeof day === 'string'){

        dateHeader.innerText = dayjs(day).format(dateFormat);

    // day is a day of the week
    } else if(typeof day === 'number'){

        dateHeader.innerText = `${daysOfTheWeek[day]} Template`;

    }
}

function fillTools(timeCells){

    const fillStartTime = document.getElementById('fill-start-time');
    const fillEndTime = document.getElementById('fill-end-time');
    const fillBtn = document.getElementById('fill-btn');

    const fillAllBtn = document.getElementById('fill-all-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

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

    const saveBtn = document.getElementById('save-btn');

    saveBtn.addEventListener('click', (e) => {
        console.log(getBusyTimes(timeCells));
    });

}

function timeGrid(timeCells){

    const timeGrid = document.getElementById('timegrid');

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